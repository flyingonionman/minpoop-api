import { User } from "../src/entities/User";
import jwt from "jsonwebtoken"
import express from 'express';
import passport from 'passport'

const router = express.Router();

router.get('/auth/github', passport.authenticate('github', {session: false}));

router.get(
    '/auth/github/callback', 
    passport.authenticate('github', {session:false}),
    (req: any, res)=> {
        res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`)
    }
);

router.get('/me',async (req,res)=>{
    const authHeader = req.headers.authorization
    if (!authHeader){
        res.send({user:null});
        return
    }

    const token = authHeader.split(" ")[1];
    if(!token){
        res.send({user:null});
        return
    }

    let userId : any = "";

    try{
        const payload : any = jwt.verify(token,process.env.JWT_SECRET);
        userId  = payload.userId;
    } catch(err){
        res.send({user:null});
        return
    }

    if (!userId){
        res.send({user : null})
    }

    const user = await User.findOne(userId)
    res.send({ user });

})



export default router;