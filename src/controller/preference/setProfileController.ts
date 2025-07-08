import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { ApiError, BodyValidationError, LoggerApiError } from "../../error/error";
import { createProfileSignature } from "../utils/signature";
import { ExpressUser } from "../../types/common";
import { dbClient } from "../../service/dbClient";

export const GetProfileSignatureController: RequestHandler = async (_, res) => {
  const signature = createProfileSignature();
  res.json({ data: signature });
};

export const SetInitProfileController: RequestHandler = async (
  req,
  res,
  next
) => {
  const validatedRes = validationResult(req);
  if (!validatedRes.isEmpty()) {
    return next(new BodyValidationError(validatedRes.array()));
  }

  const userId = (req.user as ExpressUser).id;
  const imageUrl = (req.body as { imageUrl: string }).imageUrl;

  try {
    await dbClient.profile.update({
      where: { userId: userId },
      data: { picture: imageUrl, initialized: true },
    });
    res.json({ data: { imageUrl } });
  } catch (error) {
    console.error((error as Error).message);
    return next(new LoggerApiError(error, 500));
  }
};

export const GetUserProfileController: RequestHandler = async (req, res, next) => {
  const user = (req.user) as ExpressUser;
  try {
    const userData = await dbClient.profile.findUnique({
      where: {
        userId: user.id,
      },
      omit: {
        id: true
      }
    });
    res.json({ data: userData })
  } catch (error) {
    return next(new LoggerApiError(error, 500));
  }
}

export const UpdateProfileBioController: RequestHandler = async (req, res, next) => {
  try {
    const user = (req.user) as ExpressUser;
    const bio: string | undefined = req.body?.bio;
    if (!bio) return next(new ApiError(422, "bio field is required", true))

    const bioUpdateResponse = await dbClient.profile.update({
      omit: {
        id: true,
      },
      data: {
        bio: bio
      },
      where: {
        userId: user.id
      }
    });
    res.json({ data: bioUpdateResponse })
  } catch (error) {
    return next(new LoggerApiError(error, 500))
  }
}