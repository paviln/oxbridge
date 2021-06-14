import {describe, test, it, expect} from '@jest/globals';
import * as app from "../src/app";
import request from "supertest";
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
    const result = await request(app).post("/api/user/forgotPassword");
    expect(result.text).toEqual(user);
    expect(result.status).toEqual(200);
  });
});