import { PublicKey } from '@solana/web3.js';

import { b } from '@/core';

export const METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
);

export const FIRELAUNCH_PROGRAM_ID = new PublicKey(
  'fxSY3PgGPgyTckC9CECZmCDMQfipUgPDffzwKt32dWq',
);

export const findMetadataPda = ({ mint }: { mint: PublicKey }) =>
  PublicKey.findProgramAddressSync(
    [b`metadata`, METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    METADATA_PROGRAM_ID,
  );

export const findCurvePda = ({ mint }: { mint: PublicKey }) =>
  PublicKey.findProgramAddressSync(
    [b`curve`, mint.toBuffer()],
    FIRELAUNCH_PROGRAM_ID,
  );

export const findCurvePoolPda = ({ curve }: { curve: PublicKey }) =>
  PublicKey.findProgramAddressSync(
    [b`curve_pool`, curve.toBuffer()],
    FIRELAUNCH_PROGRAM_ID,
  );

export const findCurveNativePoolPda = ({ curve }: { curve: PublicKey }) =>
  PublicKey.findProgramAddressSync(
    [b`curve_native_pool`, curve.toBuffer()],
    FIRELAUNCH_PROGRAM_ID,
  );
