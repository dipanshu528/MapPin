const jwt = require("jsonwebtoken");
const JWT_SECRET = "DKJFH4356NTEDRKJF4";

const fetchuser = async (req,res,next)=>{
    const token = req.header("auth-token");
    if(!token){
        return res.status(500).json({err:"token not found"});
    }

    try {

        const data = await jwt.verify(token, JWT_SECRET);
        if(!data){
            return res.status(500).json({err:"password not correct"});
        }

        req.user = data.user;

        
    } catch (error) {
        return res.status(500).json({err:"token not found"});
    }

    next();
}

module.exports = fetchuser;