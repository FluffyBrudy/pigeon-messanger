import { Router } from "express";
import { PREFERENCE } from "./constants";
import {
  GetProfileSignatureController,
  SetInitProfileController,
} from "../controller/preference/setProfileController";
import { initProfileValidation } from "../validator/preference/preference";

const preferanceRouter = Router();

preferanceRouter.get(
  PREFERENCE.PREF_PROFILE_SIGNATURE,
  GetProfileSignatureController
);
preferanceRouter.post(
  PREFERENCE.PREF_PROFILE_IMAGE,
  initProfileValidation,
  SetInitProfileController
);

export { preferanceRouter };
