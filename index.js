const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const cors = require("cors");
const dotenv = require("dotenv");

const postRoute = require("./routes/postRoute");
const userRoute = require("./routes/userRoute");
const komenRoute = require("./routes/komenRoute");

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/images", express.static("./images"));
app.use("/post", postRoute);
app.use("/user", userRoute);
app.use("/komen", komenRoute);

app.get("/", (req, res) => {
  res.send("index page");
});

app.listen(port, () => console.log("server berjalan di port 4000"));
