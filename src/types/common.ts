import { EMAIL, PASSWORD, USERNAME } from "../validator/auth/constants";

export type ExpressUser = { id: string; username: string };
export type RegisterBody = {
  [USERNAME]: string;
  [EMAIL]: string;
  [PASSWORD]: string;
};

export type TCursor = { cursor: { id: string } } | {};
