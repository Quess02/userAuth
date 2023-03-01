const express=require('express');
const mongoose=require('mongoose');
const app=express()
const path=require('path')

const PORT=process.env.PORT|3000
//SESSION
const session =require('express-session');
const oneDay=1000*60*60*24;
const SESS_NAME="USER_AUTH_SESS";
const SECRET_KEY='thisisanexamplekeyfgrhfrghrfjrkrkf439'
app.use(session({
    name:SESS_NAME,
    resave:false,
    saveUninitialized:false,
    secret:SECRET_KEY,
    cookie:{
        maxAge:oneDay,
        sameSite:true
    }
}));
app.use(function(req, res, next){
    // if there's a flash message, transfer
    // it to the context, then clear it
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});
//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//static middleware
app.use(express.static(path.join(__dirname,'./public')));

app.use('/auth',require('./routes/auth'))

app.get('/',(req,res)=>{
    res.redirect('/auth/login');
});
app.get('/home',(req,res)=>{
    
    res.sendFile(path.join(__dirname,'./public/home.html'));

});

app.listen(PORT, () => {
    console.log(`app started at port ${PORT}`);
});