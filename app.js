const express = require('express');
const app = express();
const port = 3003;
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require("body-parser");
const mongoose = require("./database");
const session = require("express-session");
const server = app.listen(port, () => console.log("Server listening on port" + 3003));
// get the PUG Data
app.set("view engine", "pug");
app.set("views","views");

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
//server details
app.use(session({
    secret: "BU MET",
    resave: false,
    saveUninitialized: false
}))
// Rotues
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const postRoute = require('./routes/postRoutes');
const profileRoute = require('./routes/profileRoutes');

// api routes
const postsApiRoute = require('./routes/api/posts');

const logoutRoute = require('./routes/logout');
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);
app.use("/posts", middleware.requireLogin,postRoute);
app.use("/profile", middleware.requireLogin,profileRoute);
app.use("/api/posts", postsApiRoute);
app.get("/",middleware.requireLogin, (req,res,next) => {
    var payload = {
        pageTitle: "Home",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
    }
    res.status(200).render("Home",payload);
})