import { PublicKey } from "@solana/web3.js";
import b58 from "bs58";
import { isAfter, fromUnixTime } from "date-fns";
import { Response, RequestHandler } from "express";
import { match, P } from "ts-pattern";
import nacl from "tweetnacl";
import { z } from "zod";

import { TextDecoder } from "util";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Locals {
      pubKey: string;
    }
  }
}

/**
 * Configuration context that is passed to the middleware via
 * function currying, this allows for several configurations
 * to modify how the validations are performed.
 */
const SolanaAuthConfigurationContextSchema = z.object({
  /**
   * The action field is the name of the action that is being performed.
   * This is used to determine if the signed message is correct, and also specifies
   * a permission from the client to perform an activity.
   */
  action: z.string(),
  /**
   * If set to `true`, the current execution context will skip the action check,
   * only enforcing signature and date validity. This is useful for endpoints
   * that don't require specific action permissions.
   */
  allowSkipCheck: z.boolean().optional(),
});

type SolanaAuthConfigurationContext = z.infer<
  typeof SolanaAuthConfigurationContextSchema
>;

type SolanaAuthHandlerCreator = (
  ctx: SolanaAuthConfigurationContext
) => RequestHandler;

const validateAuthHeader = (authHeader: string | undefined): string => {
  if (!authHeader) {
    throw new Error("Missing Authorization header");
  }
  const [bearer, authToken] = authHeader.split(" ");
  if (bearer.toLowerCase() !== "bearer") {
    throw new Error("Invalid Authorization header format");
  }
  if (!authToken) {
    throw new Error("Missing auth token");
  }
  return authToken;
};

const AuthTokenSchema = z.tuple([z.string(), z.string(), z.string()]);

type AuthToken = z.infer<typeof AuthTokenSchema>;

const parseAuthToken = (authToken: string): AuthToken => {
  const parts = authToken.split(".");
  const result = AuthTokenSchema.safeParse(parts);
  if (!result.success) {
    throw new Error("Invalid auth token format");
  }
  return result.data;
};

const verifySignature = (msg: string, sig: string, pk: string): boolean => nacl.sign.detached.verify(
    b58.decode(msg),
    b58.decode(sig),
    new PublicKey(pk).toBytes()
  );

const MessageSchema = z.object({
  action: z.string(),
  exp: z.number(),
});

type Message = z.infer<typeof MessageSchema>;

const decodeMessage = (msg: string): Message => {
  const decoded = JSON.parse(new TextDecoder().decode(b58.decode(msg)));
  return MessageSchema.parse(decoded);
};

const isSignatureExpired = (exp: number): boolean => isAfter(new Date(), fromUnixTime(exp));

const validateAction = (
  messageAction: string,
  expectedAction: string,
  allowSkipCheck: boolean
): boolean => {
  if (allowSkipCheck) {
    return true;
  }
  return messageAction === expectedAction;
};

/**
 * This authentication middleware is used to verify
 * that the request is signed by the owner of the public key.
 * It uses an authorization header with the following format:
 * `Authorization: Bearer pk.msg.sig`
 * Where pk is the base58-encoded public key, msg is the base58-encoded message,
 * and sig is the base58-encoded signature.
 */
export const solanaAuth: SolanaAuthHandlerCreator =
  (ctx) => (req, res, next) => {
    try {
      const validatedCtx = SolanaAuthConfigurationContextSchema.parse(ctx);
      const { action, allowSkipCheck = false } = validatedCtx;

      const authToken = validateAuthHeader(req.header("Authorization"));
      const [pk, msg, sig] = parseAuthToken(authToken);

      if (!verifySignature(msg, sig, pk)) {
        return res
          .status(401)
          .send({ error: { message: "Invalid signature" } });
      }

      const contents = decodeMessage(msg);

      if (isSignatureExpired(contents.exp)) {
        return res
          .status(401)
          .send({ error: { message: "Expired signature" } });
      }

      if (!validateAction(contents.action, action, allowSkipCheck)) {
        return res.status(401).send({ error: { message: "Invalid action" } });
      }

      res.locals.pubKey = pk;
      return next();
    } catch (error) {
      return match(error)
        .with(P.instanceOf(z.ZodError), (zodError) =>
          res.status(400).send({
            error: { message: "Invalid input", details: zodError.errors },
          })
        )
        .with(P.instanceOf(Error), (err) =>
          res.status(401).send({ error: { message: err.message } })
        )
        .otherwise(() =>
          res.status(401).send({ error: { message: "Unknown error" } })
        );
    }
  };

export const authorizedPk = (res: Response): string => res.locals.pubKey as string;
