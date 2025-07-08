import { Router } from "express";
import { PREFERENCE } from "./constants";
import {
  GetProfileSignatureController,
  GetUserProfileController,
  SetInitProfileController,
  UpdateProfileBioController,
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
preferanceRouter.get(
  PREFERENCE.PREF_PROFILE_DATA_FETCH,
  GetUserProfileController
)
preferanceRouter.post(
  PREFERENCE.PREF_BIO_UPDATE,
  UpdateProfileBioController
)


export { preferanceRouter };
