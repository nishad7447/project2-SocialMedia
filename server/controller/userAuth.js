import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../model/user.js'

export const register = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                Name,
                UserName,
                Email,
                Password,
            } = req.body

            const user = await User.findOne({ Email: Email })
            if (user) {
                return res.status(400).json({ message: "User already Exist" })
            }

            const usernameExist = await User.findOne({ UserName: UserName })
            if (usernameExist) {
                return res.status(400).json({ message: "User name taken" })
            }


            const salt = await bcrypt.genSalt()
            const passwordHash = await bcrypt.hash(Password,salt)

            const newUser = new User({
                Name,
                UserName,
                Email,
                Password: passwordHash,
            })


            await newUser.save()

            res.json({ message: "User signed up successfully" })
        } catch (error) {
            reject(res.status(500).json({ error: error.message }))
        }
    })
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
