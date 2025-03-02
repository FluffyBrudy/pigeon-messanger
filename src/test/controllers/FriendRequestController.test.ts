import request from "supertest";
import { dbClient } from "../../service/dbClient";
import { loginUser, registerUsers } from "../testUtils/authUtils";
import { app } from "../../app";
import { FRIEND_ID } from "../../validator/social/constants";
import { API, SOCIAL } from "../../router/constants";

describe("FriendRequest test", () => {
  const friendRequestRoute = API.ROOT + SOCIAL.ROOT + SOCIAL.FRIEND_REQUEST;
  const pendingRequestsRoute = API.ROOT + SOCIAL.ROOT + SOCIAL.PENDING_REQUESTS;
  const acceptRequestRoute = API.ROOT + SOCIAL.ROOT + SOCIAL.ACCEPT_REQUEST;
  const sender = {
    username: "Sam",
    email: "apple@gmail.com",
    password: "Applefruit#12",
  };
  const recvr = {
    username: "ball",
    email: "ball@gmail.com",
    password: "Applefruit#12",
  };
  let id1: string,
    id2: string,
    accessToken1: string,
    accessToken2: string,
    friendshipId: string;

  beforeAll(async () => {
    await dbClient.$connect();
    const users = [sender, recvr];
    const res = await registerUsers(users);
    expect(res.length).toBe(users.length);

    const login = await loginUser(sender.email, sender.password);
    const friendLogin = await loginUser(recvr.email, recvr.password);

    expect(login.data).toHaveProperty("id");
    expect(friendLogin.data).toHaveProperty("id");

    id1 = login.data.id;
    id2 = friendLogin.data.id;
    accessToken1 = login.data.accessToken;
    accessToken2 = login.data.accessToken;
  });

  afterAll(async () => {
    await dbClient.user.deleteMany();
  });

  test("Must give 200 status code after sending friend request ", async () => {
    const response = await request(app)
      .post(friendRequestRoute)
      .set("Authorization", `Bearer ${accessToken1}`)
      .type("json")
      .send({ [FRIEND_ID]: id2 });

    expect(response.status).toBe(200);
  });

  test("Must give 200 status code after pending friend request lookup", async () => {
    const response = await request(app)
      .get(pendingRequestsRoute)
      .set("Authorization", `Bearer ${accessToken1}`);

    expect(response.status).toBe(200);
  });

  test("Must give 200 status code and truthy with data truthy boolean value", async () => {
    const respones = await request(app)
      .post(acceptRequestRoute)
      .set("Authorization", `Bearer ${accessToken1}`)
      .type("json")
      .send({ [FRIEND_ID]: id2 });

    expect(respones.status).toBe(200);
    expect(respones.body.data).toBeTruthy();
  });

  test("Must give empty array as data after friend request accepted", async () => {
    const response = await request(app)
      .get(pendingRequestsRoute)
      .set("Authorization", `Bearer ${accessToken1}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(0);
  });
});
