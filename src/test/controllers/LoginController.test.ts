import { app } from "../../app";
import request from "supertest";
import { dbClient } from "../../service/dbClient";
import { ACCESS_TOKEN } from "../../controller/auth/constants";
import { API, AUTH } from "../../router/constants";

const data = {
  username: "Sam",
  email: "apple@gmail.com",
  password: "Applefruit#12",
};

describe("Login Route", () => {
  beforeAll(async () => {
    await dbClient.$connect();
  });

  afterAll(async () => {
    await dbClient.user.deleteMany();
  });

  test("Must return status code 200 after login", (done) => {
    request(app)
      .post(`${API.ROOT}${AUTH.ROOT}${AUTH.REGISTER}`) // Use constants for the route
      .type("json")
      .send(data)
      .then(() => {
        request(app)
          .post(`${API.ROOT}${AUTH.ROOT}${AUTH.LOGIN}`) // Use constants for the route
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
