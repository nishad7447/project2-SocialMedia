import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import dotenv from "dotenv";
dotenv.config();
import twilio from "twilio";
import crypto from "crypto";
import Token from "../model/Token.js";
import sendEmail from "../Utils/nodemailer.js";

// twilio-config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSID = process.env.TWILIO_SERVICE_SID;
const client = twilio(accountSid, authToken);

export const signupOtpSend = async (req, res) => {
  try {
    let { Name, UserName, Email, Password, Mobile } = req.body;
    Mobile = Number(Mobile).toString();

    const user = await User.findOne({ Email: Email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const usernameExist = await User.findOne({ UserName: UserName });
    if (usernameExist) {
      return res.status(400).json({ message: "Username taken" });
    }

    const mobileExist = await User.findOne({ Mobile: Mobile });
    if (mobileExist) {
      return res.status(400).json({ message: "Mobile already exists" });
    }

    const formattedMobile = `+91${Mobile}`; // Ensure the mobile number is in E.164 format

    client.verify.v2
      .services(serviceSID)
      .verifications.create({ to: formattedMobile, channel: "sms" })
      .then((verification) => {
        console.log({ verification });
        res.status(200).json({ message: "OTP sent, verification pending" });
      })
      .catch((err) => {
        console.error("Twilio API Error:", err);
        res.status(500).json({ error: err.message }); // Return the error message to the client
      });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    let { Name, UserName, Email, Password, Mobile, otp } = req.body;
    Mobile = Number(Mobile);
    otp = Number(otp);

    const user = await User.findOne({ Email: Email });
    if (user) {
      return res.status(400).json({ message: "User already Exist" });
    }

    const usernameExist = await User.findOne({ UserName: UserName });
    if (usernameExist) {
      return res.status(400).json({ message: "User name taken" });
    }

    const mobileExist = await User.findOne({ Mobile: Mobile });
    if (mobileExist) {
      return res.status(400).json({ message: "Mobile already Exist" });
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(Password, salt);
    console.log({ salt, passwordHash });
    // verify Otp
    // client.verify.v2
    // .services(serviceSID)
    // .verificationChecks.create({ to: "+91" + Mobile, code: otp })
    // .then( async (response) => {
    //   if (response.status === "approved") {
    //     const salt = await bcrypt.genSalt();
    //     const passwordHash = await bcrypt.hash(Password, salt);
    //     console.log({salt,passwordHash});
    //     const profilePics = [
    //       "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_1280.png",
    //       "https://cdn.pixabay.com/photo/2012/04/01/18/22/user-23874_1280.png",
    //       "https://cdn.pixabay.com/photo/2014/03/25/16/32/user-297330_1280.png",
    //       "https://cdn.pixabay.com/photo/2014/03/24/13/49/avatar-294480_1280.png",
    //       "https://cdn.pixabay.com/photo/2012/04/26/19/43/profile-42914_1280.png",
    //       "https://cdn.pixabay.com/photo/2016/11/08/15/21/user-1808597_1280.png",
    //       "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png",
    //     ];

    //     // Select a random profile picture URL
    //     const randomProfilePic =
    //       profilePics[Math.floor(Math.random() * profilePics.length)];

    //     const newUser = new User({
    //       Name,
    //       UserName,
    //       Email,
    //       Password: passwordHash,
    //       Mobile,
    //       ProfilePic: randomProfilePic, // Add the selected profile picture URL to the newUser object
    //       Blocked:false
    //     });

    //     await newUser.save();

    //    return res.status(200).json({ message: "Verification success" });
    //   } else {
    //     return res.status(400).json({ message: "Invalid OTP" });
    //   }
    // })
    // .catch((err) => {
    //   console.log(err, "otp verifaction err");
    //   res.status(400).json({ message: "Invalid OTP" });
    // });
    console.log({ salt, passwordHash });
    const profilePics = [
      "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_1280.png",
      "https://cdn.pixabay.com/photo/2012/04/01/18/22/user-23874_1280.png",
      "https://cdn.pixabay.com/photo/2014/03/25/16/32/user-297330_1280.png",
      "https://cdn.pixabay.com/photo/2014/03/24/13/49/avatar-294480_1280.png",
      "https://cdn.pixabay.com/photo/2012/04/26/19/43/profile-42914_1280.png",
      "https://cdn.pixabay.com/photo/2016/11/08/15/21/user-1808597_1280.png",
      "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png",
    ];

    // Select a random profile picture URL
    const randomProfilePic =
      profilePics[Math.floor(Math.random() * profilePics.length)];

    const newUser = new User({
      Name,
      UserName,
      Email,
      Password: passwordHash,
      Mobile,
      ProfilePic: randomProfilePic, // Add the selected profile picture URL to the newUser object
      Blocked: false,
    });

    await newUser.save();

    return res.status(200).json({ message: "Verification success" });
  } catch (error) {
    console.log(error, "signup catch error");
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await User.findOne({ Email: Email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (!user.Password) {
      return res
        .status(400)
        .json({ message: "Password is wrong, Try google login" });
    }

    if (user.Blocked) {
      return res.status(400).json({ message: "User is blocked" });
    }
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect credentials" });
    }

    user.Online = true;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });
    user.Password = "";
    res.status(200).json({ token, user, message: "Login Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const forgotOtpSend = async (req, res) => {
  try {
    let { Email } = req.body;
    const user = await User.findOne({ Email: Email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    // if (user.Mobile) {
    //   //otp send
    //   client.verify.v2
    //     .services(serviceSID)
    //     .verifications.create({ to: "+91" + user.Mobile, channel: "sms" })
    //     .then((verification) =>
    //       res.status(200).json({ message: "Verification Pending" })
    //     );
    // } else {
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const link = `Press this link for resetting the password of only-friends - ${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
      await sendEmail({
        email: user.Email,
        subject: "Only-Friends Password reset",
        text: link,
      });

      res
        .status(200)
        .json({ message: "password reset link sent to your email account" });
    } else {
      res
        .status(200)
        .json({
          message: "password reset link Already sent to your email account",
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const emailResetPass = async (req, res) => {
  try {
    const { userId, token } = req.params;

    // Find the user based on the userId
    const user = await User.findById({ _id: userId });
    console.log(user, "user here with token");

    if (!user) return res.status(400).send("Invalid password reset link");

    // Find the token associated with the user
    const resetToken = await Token.findOne({ userId, token });
    console.log(resetToken, "here with token");

    if (!resetToken) return res.status(400).send("Invalid password reset link");

    // Send the response to the server
    res.json({ Email: user.Email, userId, token });
  } catch (error) {
    res.status(500).send("An error occurred");
    console.log(error);
  }
};

export const forgotOtpSubmit = async (req, res) => {
  try {
    let { OTP, Email } = req.body;
    OTP = Number(OTP);
    const user = await User.findOne({ Email: Email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    //verify Otp
    client.verify.v2
      .services(serviceSID)
      .verificationChecks.create({ to: "+91" + user.Mobile, code: OTP })
      .then((response) => {
        if (response.status === "approved") {
          res.status(200).json({ message: "Verification success" });
        } else {
          res.status(400).json({ message: "Verification failed" });
        }
      })
      .catch((err) => {
        console.log(err, "otp verifaction err");
      });
  } catch (error) {
    console.log(error, "submit otp err");
  }
};

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
  try {
    const user = await User.findById({ _id: req.body.userId });
    user.Password = "";
    res.status(200).send({
      success: true,
      message: "user fetched success",
      data: user,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

export const googleSignUp = async (req, res) => {
  const token = req.body.credential;
  const decoded = jwt.decode(token);
  const { name, email, picture, jti, given_name } = decoded;

  const user = await User.findOne({ Email: email });
  if (user) {
    return res.status(400).json({ message: "User already exist" });
  }

  const newUser = new User({
    Name: name,
    Email: email,
    ProfilePic: picture,
    jti,
    UserName: given_name,
    Blocked: false,
  });

  newUser
    .save()
    .then((saved) => {
      console.log("User saved", saved);
      res.status(200).json({ message: "User saved successfully" });
    })
    .catch((err) => {
      console.error("Error saving user:", err);
      res.status(500).json({ message: "Failed to save user" });
    });
};

export const googleSignIn = async (req, res) => {
  console.log(req.body);
  const token = req.body.credential;
  const decoded = jwt.decode(token);
  console.log(decoded, "token");
  const { name, email, picture, jti } = decoded;
  try {
    const user = await User.findOne({ Email: email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    } else {
      if (user.Blocked) {
        return res.json({ success: false, message: "User is blocked" });
      }

      user.Online = true;
      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1hr",
      });
      user.Password = "";
      res.status(200).json({ token, user, message: "Login Success" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal server error");
  }
};
