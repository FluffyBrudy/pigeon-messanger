import { app } from "../../app";
import request from "supertest";
import { dbClient } from "../../service/dbClient";
import { ACCESS_TOKEN } from "../../controller/auth/constants";

beforeAll(async () => {
  await dbClient.$connect();
});

afterAll(async () => {
  await dbClient.user.deleteMany();
});

const data = {
  username: "Sam",
  email: "apple@gmail.com",
  password: "Applefruit#12",
};

describe("Login Route", () => {
  test("Must return status code 200 after login", (done) => {
    request(app)
      .post("/api/auth/register")
      .type("json")
      .send(data)
      .then(() => {
        request(app)
          .post("/api/auth/login")
          .type("json")
          .send(data)
          .then((res) => {
            expect(res.body.data).toHaveProperty(ACCESS_TOKEN);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
  });
});
