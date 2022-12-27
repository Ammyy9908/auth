const express = require("express");
const connect_db = require("./utils/db_connect");
const app = express();
const authRouter = require("./router/auth");
const PORT = process.env.PORT || 5001;
const ejs = require("ejs");
app.use(express.json());
app.set("view engine", "ejs");

app.use(express.static("public"));
app.get("/", async (req, res) => {
  res.render("index", { title: "Authentication" });
});

app.get("/profile", (req, res) => {
  res.render("profile", { title: "Profile" });
});

app.get("/logout", (req, res) => {
  res.render("logout", { title: "Logout" });
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
