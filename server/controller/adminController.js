import jwt from "jsonwebtoken";


const adminCredentials = {
    Email: 'admin@gmail.com',
    Password: '123',
  };

const adminController={
    login:async(req,res)=>{
        try {
            const { Email, Password } = req.body;
        
            if (Email !== adminCredentials.Email) {
              return res.status(400).json({ message: "Admin does not exist" });
            }
        
            if (Password !== adminCredentials.Password) {
              return res.status(400).json({ message: "Incorrect credentials" });
            }
        
            
            const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
              expiresIn: '1hr',
            });
        
            res.status(200).json({ token, role: 'admin', message: 'Login Success' });
          } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
          }
    }
}

export default adminController;