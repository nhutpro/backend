const express = require("express");
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const path = require("path");
const app = express();
const port = 3000;
const route = require("./routes");
const compression = require("compression");
require("dotenv").config();

if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https")
      res.redirect(301, `https://${req.header("host")}${req.url}`);
    else next();
  });
}
app.use(
  compression({
    threshold: 0,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "secret",
  })
);
const db = require("./config/db");
db.connect();
// Method override
app.use(methodOverride("_method"));
//HTTP logger
app.use(morgan("combined"));

//route//
route(app);
app.listen(process.env.PORT || port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
