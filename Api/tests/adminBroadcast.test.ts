import {describe, test, it, expect} from '@jest/globals';
import * as app from "../src/app";
import request from "supertest";
import { IEvent } from '../src/models/event';
import eventController from '../src/controllers/event.controller';
import supertest from "supertest";
const api = eventController;

const event = {
  eventId: 1,
  messages: "test message"
}

describe("POST /sendMessage/- admin post broadcast to event", () => {
  it("Upload broadcast API Request", async () =>{
    const result = await supertest(app).post("/api/events/sendMessage/").send(event);
    expect(result.body).toEqual(event);
    expect(result.status).toEqual(200);
  });
});
