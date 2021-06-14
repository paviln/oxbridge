import {describe, test, it, expect} from '@jest/globals';
import * as app from "../src/app";
import request from "supertest";
import { IShip } from '../src/models/ship';
import shipController from '../src/controllers/ship.controller';

const api = shipController;

const ship = {
  shipId: 1,
  emailUsername: "paviln@outlook.dk",
  name: "testbåd",
  img: [
    {
      data: 23423,
      contentType: 'image/png'
    }
  ],
};

describe("POST /uploadImage - post image of ship", () => {
  it("Upload Image API Request", async () =>{
    const result = await (await request(api).post("/api/ships/uploadImage").send({ship}));
    expect(result.body).toEqual({ship});
    expect(result.status).toEqual(204);
  });
});

describe("POST should not insert if shipID is not found", () => {
  it("Upload Image API Request", async () =>{
    const result = await request(api).post("/api/ships/uploadImage").send({ship});
    expect(result.body).toEqual("Ship not found with shipId: " + ship.shipId)
    expect(result.status).toEqual(404);
  });
});
