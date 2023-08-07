
import jwt from 'jsonwebtoken'
import User from '../model/user.js';

export const auth = async (req, res, next)=>{
    try{
        let token = req.header('authorization').split(' ')[1];
        token = token.replaceAll('"', '');
        const decryptedToken = jwt.verify(token,'hardstring' );
        console.log(decryptedToken,"decryptedtoken")
        if (decryptedToken.role === 'admin') {

            req.userRole = 'admin';
            next()

          } else {

            req.userRole = 'user';
            req.body.userId = decryptedToken.id;

            await User.findById(req.body.userId)
            .then((res)=>{
                if (res.Blocked){
                    throw new Error("jwt expired");
                }else{
                    next()
                }
            })
            
          }
       
    }catch(err){
        console.log(err,"Error in auth midware")
        res.send({
            success: false,
            message: err.message
        })
    }
}

