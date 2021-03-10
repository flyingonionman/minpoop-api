import "reflect-metadata"
require('dotenv-safe').config();

import express from 'express';
import {createConnection} from 'typeorm'
import { __prod__ } from "./constants";
import { join } from "path";
// import { User } from "./entities/User";
import { Strategy as GitHubStrategy} from 'passport-github';
import passport from 'passport'
import { User } from "./entities/User";
import jwt from "jsonwebtoken"
import cors from 'cors';
import router from "../routers/index";

(async()=>{
    await createConnection({
        type:'postgres',
        database: "minpoop",
        username: 'postgres',
        password: '0412',
        entities: [join(__dirname, './entities/*.*')],
        logging: !__prod__,
        synchronize: !__prod__,
    })

    /* const user = await User.create({
        name:"minyoung"
    }).save()

    console.log(user); */
    
    const app = express();

    passport.serializeUser(function(user : any, done) {
        done(null, user.accessToken);
    });

    app.use(cors()); 
    app.use(passport.initialize());
    app.use(express.json())


    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3002/auth/github/callback",
      },
        async (_, __, profile, cb)=> {
            let user =  await User.findOne({where: {githubId : profile.id}});
            if (user){
                user.name = profile.displayName
                await user.save();
            } else{
                user = await User.create({
                    name: profile.displayName,
                    githubId : profile.id
                }).save();

            }

            cb(null, {accessToken : jwt.sign(
                {userId: user.id}, 
                process.env.JWT_SECRET,
                {expiresIn: "1y"})
                })
            }
        )
    );

    /**
     * Routing
     * @user : auth related stuff
     * @todo : CRUD related
     */
    router.init(app)

    app.get('/', (_req, res) => {
        res.send("hello");
    });
    
    app.listen(3002, ()=>{
        console.log('listening on localhost:3002')
    });


})();