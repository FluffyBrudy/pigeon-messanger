import request from "supertest";
import { app } from "../../app";
import { dbClient } from "../../service/dbClient";
import { loginUser, registerUsers } from "../testUtils/authUtils";
import { API, PREFERENCE } from "../../router/constants";
import FormData from "form-data";
import axios from "axios";
import fs from "fs";
import { resolve } from "path";

describe("Must check validity of signature", () => {
  beforeAll(async () => {
    await dbClient.$connect();
    const user = {
      username: "Sam",
      email: "apple@gmail.com",
      password: "Applefruit#12",
    };
    const res = await registerUsers([user]);
    expect(res.length).toBe(1);
  });

  afterAll(async () => {
    await dbClient.user.deleteMany();
  });

  test("must create sha1 signature", async () => {
    const { data } = await loginUser("apple@gmail.com", "Applefruit#12");
    expect(data.accessToken).not.toBeFalsy();

    const res = await request(app)
      .get(API.ROOT + PREFERENCE.ROOT + PREFERENCE.PREF_PROFILE_SIGNATURE)
      .set("Authorization", `Bearer ${data.accessToken}`)
      .type("json");

    expect(res.status).toBe(200);

    const { signature, timestamp } = (
      res.body as { data: { signature: string; timestamp: string } }
    ).data;
    console.log(signature, timestamp);

    const filePath = resolve(__dirname, "pic.png");
    console.log(filePath);
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    formData.append("api_key", process.env.CLOUD_API_KEY!);
    formData.append("signature", "4be9217e81947d59870acf5cdf1429b6fbe89357");
    formData.append("timestamp", "1740916665");
    formData.append("folder", "pigeon-messanger");

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/image/upload`;
    console.log(cloudinaryUrl);
    const resImg = await axios.post(cloudinaryUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    expect(resImg.status).toBe(200);
    expect(resImg.data.secure_url).toBeDefined();
  });
});
