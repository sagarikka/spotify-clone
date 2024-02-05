const express = require("express");
const bcrypt = require("bcrypt")
const router = express.Router();
const User =require("../models/User");
const {getToken} =require("../utils/helpers")

//this route will help to register a user , this code will run when /register api is caleed as a post request
router.post("/register",async (req,res) => {
    const  {email,password,firstName,lastName,userName} =req.body;
   
    //if a user with given email already exist return a error statement
    //status code is by-default 200 so chnage it to 403
    const user =await User.findOne({email:email});
    if(user){
        return res.status(403).json({error:"A user with this emaail already exist"});
    }
    
    //create a new user in the db and then convert the password from plain text to hash
    const hashPassword = await bcrypt.hash(password,10);
    const newUserData ={email,password:hashPassword,firstName,lastName,userName}
    const newUser = await User.create(newUserData);

     //we want to create the token to return to the user
     const token = await getToken(email,newUser);
    
     //return the result to the user
     const userTOReturn ={...newUser.toJSON(),token};
     delete userTOReturn.password;
     return res.status(200).json(userTOReturn);
});

router.post("/login",async (req,res) => {
    const  {email,password} =req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(403).json({err:"Invalid credential"})
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(403).json({err:"Invalid credential"});
    }
    const token = await getToken(user.email,user);
     const userTOReturn ={...user.toJSON(),token};
     delete userTOReturn.password;
     return res.status(200).json(userTOReturn);
})

module.exports =router