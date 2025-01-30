import { app } from "../../app";
import request from "supertest";
import { USER_SUCCESSFULLY_CREATED } from "../../controller/auth/constants";
import { dbClient } from "../../service/dbClient";

describe("Register route", () => {
  beforeAll(async () => {
    await dbClient.$connect();
  });

  afterAll(async () => {
    await dbClient.user.deleteMany();
    await dbClient.$disconnect();
  });

  test("Must return status 200 on creating user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .type("json")
      .send({
        username: "Sam",
        email: "apple@gmail.com",
        password: "Applefruit#12",
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toBe(USER_SUCCESSFULLY_CREATED);
  });

  test("Must return status 400 on username less than 3 characters long", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .type("json")
      .send({
        username: "Sa",
        email: "apple@gmail.com",
        password: "Applefruit#12",
      });

    expect(res.status).toBe(400);
  });
});
