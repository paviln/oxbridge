import {describe, test, it, expect} from '@jest/globals';
import * as app from "../src/app";
import request from "supertest";
import { IEvent } from '../src/models/event';
import eventController from '../src/controllers/event.controller';

const api = eventController;

const event = {
  eventId: 1,
  messages: "test"
}

describe("POST /sendMessage/- admin post broadcast to event", () => {
  it("Upload broadcast API Request", async () =>{
    const result = await request(api.sendMessage).post("/api/events/sendMessage/");
    expect(result.text).toEqual(event);
    expect(result.status).toEqual(200);
  });
});
