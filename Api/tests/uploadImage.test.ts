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
      contentType: 'test file'
    }
  ],
};

describe("POST /uploadImage - post image of ship", () => {
  it("Upload Image API Request", async () =>{
    const result = await request(api.uploadImage).post("/api/ships/uploadImage");
    expect(result.text).toEqual(ship);
    expect(result.status).toEqual(200);
  });
});




