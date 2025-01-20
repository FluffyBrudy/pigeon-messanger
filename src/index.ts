import { app } from "./app";

if (process.env.NODE_ENV === "dev") {
  app.listen(3000, () => {
    console.log("Listening at: http://localhost:3000");
  });
}

export default app;
