import { z } from "zod";

export const createUserWithEmailAndPasswordInput = z.object({
  fullName: z.string().describe("full name of the user"),
  email: z.email().describe("email of the user"),
  password: z.string().describe("password of the user"),
});

export type CreateUserWithEmailAndPasswordInput = z.infer<
  typeof createUserWithEmailAndPasswordInput
>;

export const generateUserTokenPayload = z.object({
  id: z.string().describe("uuid of the user"),
});

export type GenerateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>;


export const signInWithEmailAndPasswordInput = z.object({
  email: z.email().describe("email of the user"),
  password: z.string().describe("password of the user"),
})

export type SignInWithEmailAndPasswordInput = z.infer<typeof signInWithEmailAndPasswordInput>;