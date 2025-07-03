import request from "supertest";
import app, { closeDB } from "../server.js";

afterAll(async () => {
  await closeDB(); 
});

describe("Alarm API", () => {
  it("should return 400 if time is missing", async () => {
    const res = await request(app).post("/api/alarms").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Missing time");
  });

  it("should create a new alarm", async () => {
    const res = await request(app).post("/api/alarms").send({ time: "07:30" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return list of alarms", async () => {
    const res = await request(app).get("/api/alarms");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});