
import jwt from 'jsonwebtoken'

export const auth = (req, res, next)=>{
    try{
        let token = req.header('authorization').split(' ')[1];
        token = token.replaceAll('"', '');
        console.log("token vanoooo", token );
        const decryptedToken = jwt.verify(token,'hardstring' );
        console.log(decryptedToken,'decrrrrrrrrrypt')
        req.body.userId = decryptedToken.id;
        console.log(req.body.userId)
        next()
    }catch(err){
        res.send({
            success: false,
            message: err.message
        })
    }
}

