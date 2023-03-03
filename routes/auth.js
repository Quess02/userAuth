const express=require('express');
const authRouter=express.Router();
const path =require('path');

//import mongoose and connect to mongodb
const mongoose=require('mongoose');
mongoose.Promise=global.Promise;
//var conStr="mongodb://localhost:27017/userAuth";
var conStr="mongodb+srv://quess02:jotam021198@cluster0.pgudpjp.mongodb.net/test"
mongoose.connect(conStr);

//user model 
const userModel=require('../model/user');

//validation module
const Validation=require('../controller/validation');
var valid=new Validation();

//static middleware
authRouter.use(express.static(path.join(__dirname,'../public')));

const authenticate=(req,res,next)=>{
    try {
        var email=req.body.email
        var password=req.body.password
        if(!valid.isEmpty(email)||!valid.isEmpty(password)){
            //console.log(req)
            userModel.find({'email':email}).then((doc,err)=>{
                //authenticate user
                if(doc.length>=1){
                    if (password==doc[0].password) {                          
                        req.session.user=doc[0]._id
                        redirectHome(req,res,next);
                    } 
                    else{
                        //incorrect password
                        console.log(password,doc[0].password)
                        req.session.flash='incorrect password'
                        redirectLogin(req,res,next);
                    }
                }else{
                    //user doesn't exist
                    console.log(doc)
                    req.session.flash='user does not exist'
                    redirectLogin(req,res,next);
                }
            });
        }
        else{
            next()
        }
    } 
    catch (error) {
        console.log(error);
    }
};
 var redirectLogin=(req,res,next)=>{
     if (!req.session.user) {
         res.redirect('/auth/login')
     }else{next()}
};
 var redirectHome=(req,res,next)=>{
    if(req.session.user){
        res.redirect('/home')
    }else{
        next()
    }
};
//static middleware
authRouter.use(express.static(path.join(__dirname,'public')));

authRouter.get('/login',redirectHome,(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/login.html'));
    if(res.locals.flash!==undefined){
        console.log(res.locals.flash);
    }

});

authRouter.get('/logout',(req,res,next)=>{
    if(req.session.user){
        req.session.destroy()
        res.redirect('/auth/login')
    }else{
        redirectHome(req,res,next)
    }
});
 
 authRouter.post('/login',authenticate,(req,res,next)=>{
    try {
        redirectLogin(res,req,next)
    } catch (error) {
        console.log(error);
    }
});
 authRouter.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/register.html'));
});
 authRouter.post('/register',(req,res,next)=>{
    try {
        var firstname=req.body.name;
        var surname=req.body.surname;
        var email=req.body.email;
        var password=req.body.password;
        userModel.find({'email':email},function(err,doc){
            if(doc.length===0){   
                var user=new userModel({
                    firstname:firstname,
                    surname:surname,
                    email:email,
                    password:password
                })
                user.save();
                //res.session.flash='user added successfully'
                redirectLogin(req,res,next)
            }
            else{
                //res.session.flash='user already exists'
                res.redirect('/auth/register')
            }
        });
    } catch (error) {
        console.log(error)
    }
  
});

module.exports=authRouter;
