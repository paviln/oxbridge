import {describe, test, it, expect, beforeEach} from '@jest/globals';
import app from "../src/app";
import request from "supertest";
import { IShip } from '../src/models/ship';
import shipController from '../src/controllers/ship.controller';
import supertest from "supertest";
import jest from "jest";
const api = shipController;

const ship = {
  shipId: 1,
  emailUsername: "paviln@outlook.dk",
  name: "testbåd",
  img: [
    {
      data: [],
      contentType: 'image/png'
    }
  ],
};
const user = {
  emailUsername: "paviln@outlook.dk",
  password: "1234"
}
let token = {}
const shipfail = {
  shipId: 100
}

beforeEach((done) => {
  request(app)
    .post('/login')
    .send({
      username: user.emailUsername,
      password: user.password,
    })
    .end((err, response) => {
      token = response.body.token; // save the token!
      done();
    });
});

describe("POST /uploadImage - post image of shi", () => {
  it("Upload Image API Request", async () =>{
    console.log(token);
    const result = await supertest(app).post("/api/ships/uploadImage").send(ship).set('Authorization', `${token}`);

    //expect(result.body).toEqual(ship.img);   
    expect(result.status).toEqual(204);
  });
});

describe("POST should not insert if shipID is not found", () => {
  it("Upload Image API Request", async () =>{
    const result = await supertest(app).post("/api/ships/uploadImage").send(shipfail);
    expect(result.body.message).toEqual("Ship not found with shipId: " + shipfail.shipId)
    expect(result.status).toEqual(404);
  });
});
