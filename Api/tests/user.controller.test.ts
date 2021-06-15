import {describe, test, it, expect} from '@jest/globals';
import * as app from "../src/app";
import supertest from "supertest";
import { IUser } from '../src/models/user';

const user = {
  firstname: "Jens",
  lastname: "Christensen",
  emailUsername: "paviln@outlook.dk",
  password: "1234",
  role: "user"
};

describe("POST /forgotPassword - reset password of user", () => {
  it("Forgot Password API Request", async () => {
    const result = await supertest(app).post("/api/user/forgotPassword").send(user);
    expect(result.text).toEqual(user);
    expect(result.status).toEqual(200);
  });
});