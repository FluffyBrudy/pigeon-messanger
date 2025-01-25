import pino, { transport } from "pino";

export const logger = pino(
  transport({
    level: "error",
    target: "pino/file",
    options: {
      destination: "./logs.log",
    },
  })
);
