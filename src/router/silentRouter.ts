import { Router } from "express";
import { ExpressUser } from "../types/common";

const silentRouter = Router();
silentRouter.post("/login", (req, res) => {
  const id = (req.user as ExpressUser).id;
  res.json({ data: { id } });
});

export { silentRouter };
