import { z } from 'zod';

/**
 * Represents an attribute of a token.
 */
const AttributeSchema = z.object({
  trait_type: z.string(),
  value: z.string(),
});

/**
 * Represents a file associated with a token.
 */
const FileSchema = z.object({
  uri: z.string().url(),
  type: z.string(),
  cdn: z.boolean().optional(),
});

/**
 * Represents the properties of a token.
 */
const PropertiesSchema = z.object({
  files: z.array(FileSchema),
  category: z.string(),
});

/**
 * Represents the full metadata JSON structure for a token.
 */
const MetadataJsonSchema = z.object({
  name: z.string(),
  description: z.string(),
  symbol: z.string(),
  image: z.string().url(),
  animation_url: z.string().url().optional(),
  external_url: z.string().url().optional(),
  attributes: z.array(AttributeSchema),
  properties: PropertiesSchema,
});

export type Attribute = z.infer<typeof AttributeSchema>;
export type File = z.infer<typeof FileSchema>;
export type Properties = z.infer<typeof PropertiesSchema>;
export type MetadataJson = z.infer<typeof MetadataJsonSchema>;

/**
 * Builds and validates an array of attributes.
 * @param attributes - The array of attributes to validate.
 * @returns The validated array of attributes.
 */
export const buildAttributes = (attributes: Attribute[]): Attribute[] => z.array(AttributeSchema).parse(attributes);

/**
 * Builds and validates the properties object.
 * @param properties - The properties object to validate.
 * @returns The validated properties object.
 */
export const buildProperties = (properties: Properties): Properties => PropertiesSchema.parse(properties);

/**
 * Validates and constructs a MetadataJson object.
 * @param name - The name of the token.
 * @param description - The description of the token.
 * @param symbol - The symbol of the token.
 * @param image - The URL of the token's image.
 * @param attributes - An array of attributes for the token.
 * @param properties - The properties object for the token.
 * @param animation_url - Optional URL for token animation.
 * @param external_url - Optional external URL for the token.
 * @returns A validated MetadataJson object.
 */
export const validateMetadataJson = (
  name: string,
  description: string,
  symbol: string,
  image: string,
  attributes: Attribute[],
  properties: Properties,
  animation_url?: string,
  external_url?: string,
): MetadataJson => MetadataJsonSchema.parse({
    name,
    description,
    symbol,
    image,
    animation_url,
    external_url,
    attributes,
    properties,
  });
