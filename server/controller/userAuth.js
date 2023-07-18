import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../model/user.js'
import dotenv from 'dotenv'
dotenv.config()
import twilio from "twilio";

// twilio-config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSID = process.env.TWILIO_SERVICE_SID;
const client = twilio(accountSid, authToken);

export const register = async(req, res) => {
    try {
            let {
                Name,
                UserName,
                Email,
                Password,
                Mobile
            } = req.body
            Mobile=Number(Mobile)
            const user = await User.findOne({ Email: Email })
            if (user) {
               return res.status(400).json({ message: "User already Exist" })
            }

            const usernameExist = await User.findOne({ UserName: UserName })
            if (usernameExist) {
               return res.status(400).json({ message: "User name taken" })
            }

            const mobileExist= await User.findOne({Mobile:Mobile})
            if(mobileExist){
               return res.status(400).json({message:"Mobile already Exist"})
            }

            const salt = await bcrypt.genSalt()
            const passwordHash = await bcrypt.hash(Password,salt)

            const newUser = new User({
                Name,
                UserName,
                Email,
                Password: passwordHash,
                Mobile
            })


            await newUser.save()

           res.json({ message: "User signed up successfully" })
        } catch (error) {
            console.log(error,"signup catch error")
            res.status(500).json({ error: error.message })
        }
}

export const login =async(req,res)=>{
    try{
        console.log(req.body)
        const {Email,Password}=req.body
        const user = await User.findOne({Email:Email})
        if(!user){
            return res.status(400).json({message:"User does not exist"})
        } 

        const isMatch=await bcrypt.compare(Password,user.Password)
        if(!isMatch) {
            return res.status(400).json({message:"Incorrect credentials"})
        }
        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:'1hr'})
        user.Password=""
        console.log(user)
        res.status(200).json({token,user,message:"Login Success"})

    }catch (error) {
        console.log(error)
        res.status(500).json({error:error.message})   
      }
}

export const forgotOtpSend=async(req,res)=>{
    try {
        let { Email } = req.body;
        const user = await User.findOne({ Email: Email });
        if (!user) return res.status(400).json({ message: "User does not exist" });
    
        //otp send
        client.verify.v2.services(serviceSID)
        .verifications
        .create({to: '+91'+user.Mobile, channel: 'sms'})
        .then(verification => res.status(200).json({message:"Verification Pending"}));

      } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
}

export const forgotOtpSubmit=async(req,res)=>{
    try{
        let {OTP,Email} =req.body
        OTP=Number(OTP)
        const user = await User.findOne({ Email: Email });
        if (!user) return res.status(400).json({ message: "User does not exist" });
        console.log(accountSid,'asid')
        //verify Otp
        client.verify.v2
      .services(serviceSID)
      .verificationChecks.create({ to: "+91" + user.Mobile , code: OTP })
      .then((response) => {
        if (response.status === "approved") {

            res.status(200).json({message:"Verification success"})
          
          } else {
  
            res.status(400).json({message:"Verification failed"})

          }

      })
      .catch((err)=>{
        console.log(err,"otp verifaction err")
      })

    }catch(error){
        console.log(error,"submit otp err")
    }
}

export const forgotPass = async (req, res) => {
    try {
      let { Email, Password } = req.body;
      const user = await User.findOne({ Email: Email });
      if (!user) return res.status(400).json({ message: "User does not exist" });
  
      const salt = await bcrypt.genSalt();
      Password = await bcrypt.hash(Password, salt);
  
      await User.findOneAndUpdate({ Email: Email }, { Password: Password });
  
      res.status(200).json({ message: "Reset Password Success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  };
  

export const getUser = async (req, res) => {

    console.log("working....", req.body.userId);
    try {
        const user = await User.findById({ _id: req.body.userId });
        user.Password=""
        res.send({
            success: true,
            message: "user fetched success",
            data: user
        })
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
}
