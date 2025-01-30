import request from "supertest";
import { app } from "../../app";
import { dbClient } from "../../service/dbClient";
import { SEARCH_TERM } from "../../validator/social/constants";
import { FILTER, UNKNOWN } from "../../controller/social/constants";
import { registerUsers, loginUser } from "../testUtils/authUtils";

describe("Must return us", () => {
  beforeAll(async () => {
    await dbClient.$connect();
    const users = [
      { username: "Sam", email: "apple@gmail.com", password: "Applefruit#12" },
      {
        username: "John",
        email: "banana@example.com",
        password: "Applefruit#12",
      },
      {
        username: "Emily",
        email: "cherry@test.com",
        password: "Applefruit#12",
      },
    ];
    const res = await registerUsers(users);
    expect(res?.length).toBe(users.length);
  });

  afterAll(async () => {
    await dbClient.user.deleteMany();
  });

  test("Must return john on keyword starting with j with letter case ignored", async () => {
    const { data } = await loginUser("apple@gmail.com", "Applefruit#12");
    expect(data.accessToken).not.toBeFalsy();

    const res = await request(app)
      .post("/api/social/friends-search")
      .set("Authorization", `Bearer ${data.accessToken}`)
      .type("json")
      .send({ [SEARCH_TERM]: "j", [FILTER]: UNKNOWN });
    expect(res.status).toBe(200);
  });
});
