import { Router } from "express";
import { PREFERENCE } from "./constants";
import { GetProfileSignatureController } from "../controller/preference/setProfileController";

const preferanceRouter = Router();

preferanceRouter.get(
  PREFERENCE.PREF_PROFILE_SIGNATURE,
  GetProfileSignatureController
);

export { preferanceRouter };
