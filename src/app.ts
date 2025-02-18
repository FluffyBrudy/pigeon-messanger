import { config } from "dotenv";
import express from "express";
import expressSession from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import cors from "cors";
import { dbClient } from "./service/dbClient";
import { ExpressUser } from "./types/common";
import { ApiError } from "./error/error";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { apiRouter } from "./router/apiRouter";
import { API } from "./router/constants";

declare global {
  namespace Express {
    interface Request {
      User: ExpressUser | undefined;
    }
  }
}

config();

const app = express();

const expressSessionConfig = expressSession({
  secret: process.env.SESSION_SECRET!,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "prod",
    httpOnly: process.env.NODE_ENV === "prod",
  },
});

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
};
const strategy = new JWTStrategy(opts, async (payload: ExpressUser, done) => {
  try {
    const user = await dbClient.user.findUnique({
      where: { id: payload.id },
      select: { id: true, username: true },
    });
    if (!user) return done(new ApiError(404, "User"), false);
    else return done(null, user);
  } catch (error) {
    return done(new ApiError(505), false);
  }
});

app.use(
  cors((req, cb) => {
    const origin = req.headers["origin"];
    const frontendUrls = process.env.FRONTEND_URLS!.split(",");
    if (!origin) cb(null, { origin: false, credentials: false });
    else if (frontendUrls.includes(origin))
      cb(null, { origin: true, credentials: true });
    else cb(null, { origin: true, credentials: false });
  })
);

app.use(cookieParser(process.env.COOKIE_SECRET!));
app.use(express.json());
app.use(expressSessionConfig);
app.use(passport.session());
passport.use(strategy);

app.use(API.ROOT, apiRouter);

app.use(errorMiddleware());

if (process.env.NODE_ENV === "dev" && process.env.LOG_ENDPOINTS) {
  console.log(require("express-list-endpoints")(app));
}

export { app };
