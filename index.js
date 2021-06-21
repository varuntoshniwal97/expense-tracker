const express = require("express");
const bodyParser = require("body-parser");
const InititateMongoServer = require("./config/db");
const user = require("./routes/users");
const expenses = require("./routes/expenses");

const app = express();
InititateMongoServer();
// PORT
const PORT = process.env.PORT || 4000;
app.use(bodyParser.json())
app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

app.use("/user", user)
app.use(expenses)

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});