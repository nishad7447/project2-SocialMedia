import mongoose from "mongoose";

const userSchema= new mongoose.Schema(
    {
        Name:{
            type:String,
            required:true,
            min:2,
            max:50,
        },
        UserName:{
            type:String,
            required:true,
            unique:true
        },
        Email:{
            type:String,
            required:true,
            unique:true,
            max:50
        },
        Mobile: {
            type: Number,
            unique: true,
            max: 999999999999, 
          },          
        Password:{
            type:String,
            min:5
        },
        ProfilePic:{
            type:String,
            default:'',
        },
        Followers:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }],
        Followings:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }],
        ChatIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'chat',
          }],
        Online:Boolean,
        Blocked:Boolean,
        Location:String,
        Occupation:String,
        Bio:String,
        jti: {
            type: String,
        },
     }
    ,{timestamps:true}
     )

     const User= mongoose.model('User',userSchema)
     export default User;