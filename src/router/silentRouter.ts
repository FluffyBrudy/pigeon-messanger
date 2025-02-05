import { Router } from "express";
import { ExpressUser } from "../types/common";
import { SILENT } from "./constants";

const silentRouter = Router();
silentRouter.post(SILENT.LOGIN, (req, res) => {
  const id = (req.user as ExpressUser).id;
  res.json({ data: { id } });
});

export { silentRouter };
