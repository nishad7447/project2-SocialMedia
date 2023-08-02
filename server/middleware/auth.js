
import jwt from 'jsonwebtoken'

export const auth = (req, res, next)=>{
    try{
        let token = req.header('authorization').split(' ')[1];
        token = token.replaceAll('"', '');
        const decryptedToken = jwt.verify(token,'hardstring' );
        console.log(decryptedToken,"decryptedtoken")
        if (decryptedToken.role === 'admin') {

            req.userRole = 'admin';
          } else {

            req.userRole = 'user';
            req.body.userId = decryptedToken.id;
          }
        next()
    }catch(err){
        console.log(err,"Error in auth midware")
        res.send({
            success: false,
            message: err.message
        })
    }
}

