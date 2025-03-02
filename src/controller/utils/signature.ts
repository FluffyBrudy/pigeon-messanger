import { imageClient } from "../../service/imageClient";

export const createProfileSignature = () => {
  return imageClient.createSignature();
};
