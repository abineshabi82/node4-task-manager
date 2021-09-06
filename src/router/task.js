const express = require('express')
const Task = require('../model/task.js')
const auth = require('../middleware/auth.js')

const taskRoute = express.Router()

taskRoute.post('/', auth, async (req, res) => {
    const task = new Task({ ...req.body, owner: req.user._id })
    try {
        await task.save()
        res.status(201).json(task)
    }
    catch (err) {
        res.status(400).json(err)
    }

    // task.save()
    // .then(task1=>{
    //     res.status(201).json(task1)
    // })
    // .catch(err=>{
    //     res.status(400).json(err)
    // })
})

//Queries=completed,limit,skip,sort
taskRoute.get('/', auth, async (req, res) => {
    let match = {}
    let sort={}
    if (req.query.completed) {
        match.completed = req.query.completed ==='true'
    }
    if(req.query.sort){
        let parts=req.query.sort.split(':')
        sort[parts[0]]=parts[1]=='desc'?-1:1
    }

    try {
        let tasks = await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit||null),
                skip:parseInt(req.query.skip||null),
                sort
            }
        }).execPopulate();
        if (!tasks.tasks)
            res.status(404).json({})
        tasks = tasks.tasks
        res.json(tasks)
    }
    catch (err) {
        res.status(500).json(err)
    }

    // Task.find()
    // .then(tasks=>{
    //     if(!tasks)
    //     res.status(404).json({})

    //     res.json(tasks)
    // })
    // .catch(err=>{
    //     res.status(500).json(err)
    // })
})

taskRoute.get('/:id', auth, async (req, res) => {

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task)
            res.status(404).json({})

        res.json(task)
    }
    catch (err) {
        res.status(500).json(err)
    }

    // Task.findById(req.params.id)
    // .then(task=>{
    //     if(!task)
    //     res.status(404).json({})

    //     res.json(task)
    // })
    // .catch(err=>{
    //     res.status(500).json(err)
    // })
})

taskRoute.patch('/:id', auth, async (req, res) => {
    const allowedUpdates = ["description", "completed"];
    const updates = Object.keys(req.body);
    const valid = updates.every((update) => allowedUpdates.includes(update))
    if (!valid)
        return res.status(400).json({ error: "bad request" })
    try {
        const task = await Task.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true, runValidators: true })
        if (!task)
            return res.status(404).json({ error: "not found" })

        res.status(200).json(task);
    }
    catch (err) {
        res.status(500).json(err);
    }
})

taskRoute.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).json({ error: "not found" });
        }
        res.json(task);

    } catch (err) {
        return res.status(500).json({ error: err });
    }
})

module.exports = taskRoute