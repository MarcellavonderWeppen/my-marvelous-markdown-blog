console.log("Node.js version:", process.version);

const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models/article");
const articleRouter = require("./routes/articles");
const dotenv = require("dotenv");
const methodOverride = require("method-override"); // <a> only accept GET, <form> only GET and POST -> you need to override the method, for example for a DELETE button
const ejs = require("ejs");
const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
// express.urlencoded() can do everything express.json() can do, PLUS handle form requests
// remember to put the body-parser ABOVE routers (in this case above articleRouter )

app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index", { articles: articles });
});

app.use("/articles", articleRouter);
// best practice: put routers to the bottom, just above app.listen(PORT)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(
    "Your faithful server is listening and at your service at PORT ",
    PORT
  );
});
