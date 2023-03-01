const mongoose= require("mongoose");

/**
 * User model
 */

    const Schema=mongoose.Schema;
    var userSchema= new Schema({
        firstname:{type:String,required:true},
        surname:{type:String,required:true},
        email:{type:String,required:true},
        password:String
    });
    userSchema.pre('save',function(next){
        console.log("saving")

        next();
    });
    userSchema.post('save',function(doc){
        console.log("saved")
    });
module.exports=mongoose.model('User',userSchema);