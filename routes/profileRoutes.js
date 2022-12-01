const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../schema/userSchema');
const bcrypt = require("bcrypt");

router.get("/", (req,res,next) => {
        // data of the user login
    var payload = {
        pageTitle: req.session.user.username,
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        profileUser: req.session.user
    }

        // if login successful, show the profile page using data from the login
        res.status(200).render("profilePage", payload);
})

router.get("/:username", async (req, res, next) => {
    var payload = await getPayload(req.params.username, req.session.user);

    res.status(200).render("profilePage", payload);
})

router.get("/:username/replies", async (req, res, next) => {
    var payload = await getPayload(req.params.username, req.session.user);
    payload.selectedTab = "replies";

    res.status(200).render("profilePage", payload);
})

// if user cant be found
async function getPayload(username, userLoggedIn){
    var user = await User.findOne({ username: username})

    if(user == null){

        user = await User.findById(username)
        if(user == null){
            return{
                pageTitle: "user not found",
                userLoggedIn: userLoggedIn,
                userLoggedInJs: JSON.stringify(userLoggedIn)
            }
        }
    }

    return{
        pageTitle: user.username,
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn),
        profileUser: user
    }
}

module.exports = router;