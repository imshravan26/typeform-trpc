import {
  createUserWithEmailAndPasswordInput,
  type CreateUserWithEmailAndPasswordInput,
  generateUserTokenPayload,
  type GenerateUserTokenPayloadType,
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

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInput) {
    const { fullName, email, password } =
      await createUserWithEmailAndPasswordInput.parseAsync(payload);

    //check if the user is already existing or not
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) throw new Error("User with this email already exists");

    //calcaulate salt & hash for the password
    const salt = randomBytes(16).toString("hex");
    const hash = createHmac("sha256", salt).update(password).digest("hex");

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
}

export default UserService;
