const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/userModel');

Router.get('/user', async (req, res) => {
    try{
        const retrieveUsers = await userSchema.find({}, { _id: 1, name: 1, email: 1 });
        if(retrieveUsers === null){
            res.status(404).json({ status: "Success", message: "No user was found" });
            return;
        }
        res.status(200).json({ status: "Success", user: retrieveUsers });
    }catch(error){
        res.status(500).json({ status: "Failed", message: error.message });
    }
});

Router.get('/user/:id', async(req, res) => {
    const query = { _id: req.params.id };
    try{
        const retrieveUser = await userSchema.findOne(query, { _id: 1, name: 1, email: 1 });
        if(retrieveUser === null){
            res.status(404).json({ status: "Success", message: "User not found!" });
            return;
        }

        res.status(200).json({ status: "Success", user: retrieveUser });
    }catch(error){
        res.status(500).json({ status: "Failed", message: error.message });
    }
});

Router.post('/register', async (req, res) => {
    if(req.body.name && req.body.email && req.body.password){
        const query = { email: req.body.email };
        const verify = await userSchema.findOne(query);

        if(verify != null){
            res.status(400).json({ status: "Success", message: "Email already in use!" });
            return;
        }

        const userData = new userSchema({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
    
        try{
            var newUser = await userData.save();
            res.status(201).json({ status: "Successful", message: "User successfully created!" });
        }catch(error){
            res.status(500).json({ status: "Failed", message: error.message });
        }
        return;
    }

    res.status(400).json({ status: "Success", message: "All fields must be filled!" });
});

Router.post('/login', async (req, res) => {
    const query = {email: req.body.email};
    try{
        const foundUser = await userSchema.findOne(query);

        if(!foundUser){
            res.status(404).json({ status: "Success", message: "Wrong email or password" });
            return;
        }

        const validPass = await bcrypt.compare(req.body.password, foundUser.password);
        
        if(!validPass){
            res.status(401).json({ status: "Success", message: "Wrong email or password" });
            return;
        }

        newToken = jwt.sign({ id: foundUser.id, email: foundUser.email, password: foundUser.password }, process.env.SECRET, { expiresIn: "1800s" });
        res.status(200).json({ status: "Success", message: "Authorized", token: newToken });

    }catch(error){
        res.status(500).json({ status: "Failed", message: error.message });
    }
});

Router.delete('/user/:id', async(req, res) => {
    const query = { _id: req.params.id };
    const token = req.headers['authorization'];

    if(!token){
        res.status(403).json({ status: "Success", message: "Unauthorized" });
        return;
    }

    try{
        const deleteUser = await userSchema.deleteOne(query);
        res.status(200).json({ status: "Success", message: "User deleted!" });
    }catch(error){
        res.status(500).json({ status: "Failed", message: error.message });
    }
});

Router.put('/user/:id', async(req, res) => {
    const token = req.headers['authorization'];
    if(!token){
        res.status(403).json({ status: "Success", message: "Unauthorized" });
        return;
    }
    const query = { _id: req.params.id };

    if(req.body.name === undefined){
        res.status(400).json({ status: "Success", message: "All fields must be filled!" });
        return;
    }

    const newUser = {
        name: req.body.name
    }

    try{
       const updateUser = await userSchema.updateOne(query, newUser);
       res.status(200).json({ status: "Success", message: "User updated" }); 
    }catch(error){
        res.status(500).json({ status: "Failed", message: error.message });
    }

});
module.exports = Router;
