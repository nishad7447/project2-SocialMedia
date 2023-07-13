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
        Password:{
            type:String,
            required:true,
            min:5
        },
        ProfilePic:{
            type:String,
            default:'',
        },
        Followers:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'followers'
        },
        Followings:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'followings'
        },
        ChatIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'chat',
          }],
        Online:Boolean,
        Blocked:Boolean,
        Location:String,
        Occupation:String,
     }
    ,{timestamps:true}
     )

     const User= mongoose.model('User',userSchema)
     export default User;