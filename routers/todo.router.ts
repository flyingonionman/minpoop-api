import { Todo } from "../src/entities/Todo";
import express from 'express';
import {isAuth} from '../middleware/isAuth'

const router = express.Router();

router.post("/todo", isAuth, async (req :any, res)=>{
    const todo = await Todo.create({
        text:req.body.text, 
        creatorId: req.userId,
    }).save();
    res.send({todo});
})


export default router