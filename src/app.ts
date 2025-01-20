import { config } from "dotenv";
import express from "express";
import expressSession from "express-session";
import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { dbClient } from "./service/dbClient";
import { ExpressUser } from "./types/common";
import ApiError from "./error/error";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { verifyAuth } from "./middleware/authVerification";

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressSessionConfig);
app.use(passport.session());
passport.use(strategy);

app.use("/", verifyAuth(), (req, res) => {
  res.json({ msg: "hello" });
});

app.use(errorMiddleware());

export { app };
