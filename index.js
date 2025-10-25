import express from "express";
import webhookRoute from "./routes/webhookRoute.js";
const app = express();
const port = 3000;

app.use("/webhook", webhookRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
