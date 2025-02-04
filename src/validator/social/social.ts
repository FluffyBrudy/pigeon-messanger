import { idValidation } from "../validatorHelper";
import { CURSOR, FRIEND_ID } from "./constants";
import { searchTermBody } from "./validatorBody";

export const findFriendsValidator = [
  idValidation(CURSOR, true),
  searchTermBody,
];
export const addFriendValidation = [idValidation(FRIEND_ID)];
export const accetpFriendValidation = addFriendValidation;
export const deleteOrCancelPendingRequestValidation = addFriendValidation;
