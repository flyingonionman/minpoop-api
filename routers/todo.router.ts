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

router.get("/todo", isAuth, async (req : any, res)=>{
    const todos = await Todo.find({
        where :{creatorId: req.userId},
        order: { id: "DESC" },
    });
    res.send({todos})
})

router.put("/todo", isAuth, async (req :any, res)=>{
    const todo = await Todo.findOne(req.body.id);
    if(!todo){
        res.send({todo:null});
        return
    }

    if (todo.creatorId !== req.userId){
        throw new Error("not authorized")
    }

    todo.completed = !todo.completed
    await todo.save()
    res.send({todo});
})


export default router