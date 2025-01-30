import request from "supertest";
import { app } from "../../app";
import { ACCESS_TOKEN } from "../../controller/auth/constants";

export const registerUsers = async (
  users: { username: string; email: string; password: string }[]
) => {
  const responses = await Promise.all(
    users.map((user) =>
      request(app).post("/api/auth/register").type("json").send(user)
    )
  );

  return responses.map((res) => res.body);
};

export const loginUser = async (email: string, password: string) => {
  const res = await request(app)
    .post("/api/auth/login")
    .type("json")
    .send({ email, password });

  return res.body as { data: { [ACCESS_TOKEN]: string; id: string } };
};
