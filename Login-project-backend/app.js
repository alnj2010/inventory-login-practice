const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

require("dotenv").config();

const port = process.env.PORT || 3100;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/login", require("./routes/login"));
app.use("/api/signup", require("./routes/signup"));
app.use("/api/signout", require("./routes/signout"));
app.use("/api/user", require("./routes/user"));
app.use("/api/todos", require("./routes/todos"));
app.use("/api/refresh-token", require("./routes/refreshToken"));

app.get("/", (req, res) => {
  res.send("Hello Word!");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
