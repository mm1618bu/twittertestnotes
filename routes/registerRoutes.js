const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require('../schema/userSchema');
app.set("view engine", "pug");
app.set("views","views");
app.use(bodyParser.urlencoded({extended:false}));

router.get("/", (req,res,next) => {  //get the register page
        res.status(200).render("register");
})

router.post('/', async (req, res, next) => {  // post new registration data to database
    const firstName = req.body?.firstName?.trim(); // .trim() removes all whitespace
    const lastName = req.body?.lastName?.trim();
    const username = req.body?.username?.trim();
    const email = req.body?.email?.trim();
    const {
      password,
    } = req.body;
    const payload = req.body;
    if (  // determine if data is already in the DB
      !firstName
      || !lastName
      || !username
      || !email
      || !password
    ) {
      payload.errorMessage = 'Make sure each field has a valid value.';
      res.status(400).render('register');
      return;
    }
  
    try {
      const user = await User.findOne({
        $or: [
          { username },
          { email },
        ],
      });
  
      if (!user) {  // if user is not found
        const data = req.body;
        data.password = await bcrypt.hash(password, 10);  // hash the password
        const user = await User.create(data)
        req.session.user = user; // create user
        res.redirect('/'); // send to homepage
        return;
      }
  
      if (email === user.email) {  // if user data is found already
        payload.errorMessage = 'email already in use.';
      } else {
        payload.errorMessage = 'username already in use.';
      }
      res.status(400).render('register', payload);
    } catch (err) {
      console.log(error);
      payload.errorMessage = 'Error.';
      res.status(500).render('register', payload);
    }
  });
module.exports = router;