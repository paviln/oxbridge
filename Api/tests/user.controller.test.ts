import {describe, test, it, expect} from '@jest/globals';
import app from "../src/app";
import supertest from "supertest";
import { IUser } from '../src/models/user';

const user = {
  firstname: "Jens",
  lastname: "Christensen",
  emailUsername: "paviln@outlook.dk",
  password: "1234",
  role: "user"
};

const failuser = {
  firstname: "testfail",
  lastname: "testfail",
  emailUsername: "testfail@testfail.dk",
  password: "1234",
  role: "user"
}

describe("POST /forgotPassword - reset password of user", () => {
  it("Forgot Password API Request", async () => {
    const result = await supertest(app).post("/api/users/forgotPassword").send(user);
    expect(result.status).toEqual(200);
  });
});

describe("POST /forgotPassword - reset password of user with fail", () => {
  it("Forgot Password API Request", async () => {
    const result = await supertest(app).post("/api/users/forgotPassword").send(failuser);
    expect(result.status).toEqual(404);
  });
});