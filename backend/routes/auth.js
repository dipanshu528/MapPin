const express = require("express");
const router = express.Router();
const User = require("../modals/User.js");
const {body, validationResult} = require('express-validator');
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser.js");
const JWT_SECRET = "DKJFH4356NTEDRKJF4";



router.post("/googlelogin", async (req, res) => {
    const { name, email, picture } = req.body;

    let success = false;

    try {
        let user = await User.findOne({ email });

        // If user doesn't exist, create a new one
        if (!user) {
            user = await User.create({
                name,
                email,
                password: "GOOGLE_AUTH_USER", // Dummy password
                picture: picture || ""
            });
        }

        const data = {
            user: {
                id: user.id
            }
        };

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;

        res.json({ success, authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error during Google Login");
    }
});




router.post("/createuser", [
    body('name', 'enter a valid name').isLength({min : 3}),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password must be atleast 5 character').isLength({min:5})
] ,async (req, res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    
    let success = false;


     try {

        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(500).json({success  ,err:"username already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        const data = {
            user:{
                id: user.id
            }
        }
        success = true;

        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({success, authtoken});

        
     } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
     }
})


router.post("/login", [
   
    body('email', 'enter a valid email').isEmail(),
    body('password', 'enter a valid name').isLength({min : 3}),
] ,async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }

    let success = false;
      try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(500).json({success, err:"email not found"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(500).json({success, err:"password not match"});
        }

        const data = {
            user:{
                id: user.id
            }
        }

        success = true;

        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({success, authtoken});
        
      } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
        
      }
})



router.get("/getuser",fetchuser, async(req,res)=>{
    try {
        let userid = req.user.id;
        const user = await User.findById(userid).select("-password");
        res.json(user);
    } catch (error) {
        console.error( error.message);
        return res.status(500).send("internal server error")
    }
})

module.exports = router;