import { Schema, model, type InferSchemaType } from 'mongoose';

/** Mongoose schema for application users (Model layer). */
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: unknown };

/** Public representation of a user (never exposes the password hash). */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
}

export const UserModel = model('User', userSchema);

export function toPublicUser(doc: UserDocument): PublicUser {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
  };
}
