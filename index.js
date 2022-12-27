const express = require("express");
const connect_db = require("./utils/db_connect");
const app = express();
const authRouter = require("./router/auth");
const PORT = process.env.PORT || 5001;
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRouter);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  if (await connect_db()) {
    console.log("Database Connected");
  } else {
    console.log("Database Not Connected");
  }
});
