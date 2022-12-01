const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../schema/userSchema');
const bcrypt = require("bcrypt");

router.get("/:id", (req,res,next) => {
// loads user posts based on whos logged in
    var payload = {
        pageTitle: "View Post",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        postId: req.params.id
    }


        res.status(200).render("postPage", payload);
})


module.exports = router;