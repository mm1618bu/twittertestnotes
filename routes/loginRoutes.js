const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../schema/userSchema');
const bcrypt = require("bcrypt");
app.set("view engine", "pug");
app.set("views","views");
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req,res,next) => {
        res.status(200).render("login");
})

router.post("/", async(req,res,next) => {

        var payload = req.body;
        // find the user in the system that is trying to login
        if(req.body.logUsername && req.body.logPassword){
                var user = await User.findOne({
                        $or: [
                                { username: req.body.logUsername },
                                { email: req.body.logUsername }
                        ]
                })
                .catch((error) => { // if they cannt be found/athenticated
                        console.log(error);
                        payload.errorMessage = "something went wrong.";
                        res.status(200).render("login", payload);
                });
                if (user != null){
                        var result = await bcrypt.compare(req.body.logPassword,user.password);

                        if(result === true){ // if password is wrong
                                req.session.user = user;
                                return res.redirect("/");
                        }
                }
                payload.errorMessage = "login creds wrong.";
                return res.status(200).render("login", payload);
        }
        payload.errorMessage = "check values";
        res.status(200).render("login");
})


module.exports = router;