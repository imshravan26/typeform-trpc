import {
  createUserWithEmailAndPasswordInput,
  type CreateUserWithEmailAndPasswordInput,
  generateUserTokenPayload,
  type GenerateUserTokenPayloadType,
  signInWithEmailAndPasswordInput,
  SignInWithEmailAndPasswordInput,
} from "./model";
import * as jwt from "jsonwebtoken";
import { randomBytes, createHmac } from "node:crypto";
import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import { env } from "../env";

class UserService {
  private async getUserByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!result || result.length === 0) return null;
    return result[0];
  }

  private async generateUserToken(payload: GenerateUserTokenPayloadType) {
    const { id } = await generateUserTokenPayload.parseAsync(payload);
    const token = jwt.sign({ id }, env.JWT_SECRET);
    return { token };
  }

  private async generatehash(salt: string, password: string) {
    return createHmac("sha256", salt).update(password).digest("hex");
  }

  private async verifyUserToken(token: string): Promise<GenerateUserTokenPayloadType> {
    try {
      const verificationResult = jwt.verify(token, env.JWT_SECRET) as GenerateUserTokenPayloadType;
      return verificationResult;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  private async getuserInfo(id: string) {
    const user = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        fullName: usersTable.fullName,
        avatarURL: usersTable.avatarUrl,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));
    if (!user || user.length === 0) throw new Error("User not found");
    return user[0]!;
  }

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInput) {
    const { fullName, email, password } =
      await createUserWithEmailAndPasswordInput.parseAsync(payload);

    //check if the user is already existing or not
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) throw new Error("User with this email already exists");

    //calcaulate salt & hash for the password
    const salt = randomBytes(16).toString("hex");
    const hash = await this.generatehash(salt, password);

    // create the user in the database
    const userInsertResult = await db
      .insert(usersTable)
      .values({ fullName, email, password: hash, salt })
      .returning({
        id: usersTable.id,
      });

    if (!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id)
      throw new Error("something went wrong");
    const userId = userInsertResult[0].id;
    const { token } = await this.generateUserToken({ id: userId });

    return {
      id: userId,
      token,
    };
  }

  public async signInWithEmailAndPassword(payload: SignInWithEmailAndPasswordInput) {
    const { email, password } = await signInWithEmailAndPasswordInput.parseAsync(payload);

    const existingUser = await this.getUserByEmail(email);

    if (!existingUser) throw new Error("Invalid email or password");

    if (!existingUser.salt || !existingUser.password) throw new Error("Invalid email or password");

    const hash = await this.generatehash(existingUser.salt, password);

    if (hash !== existingUser.password) throw new Error("Invalid email or password");

    const { token } = await this.generateUserToken({ id: existingUser.id });
    return {
      id: existingUser.id,
      token,
    };
  }

  public async verifyAndDecodeUserToken(token: string) {
    const { id } = await this.verifyUserToken(token);
    const userInfo = await this.getuserInfo(id);
    return {
      ...userInfo,
    };
  }
}

export default UserService;
