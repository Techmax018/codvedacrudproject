const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// 1. GET all tasks
router.get('/', async (req, res) => {
  try {
    // Sorting by newest first
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST a new task (Now includes reminder AND priority)
router.post('/', async (req, res) => {
  const task = new Task({
    title: req.body.title,
    reminder: req.body.reminder, // REQUIRED per your schema
    priority: req.body.priority   // Optional, defaults to 'Medium'
  });
  
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    // If reminder is missing, this will catch the Mongoose validation error
    res.status(400).json({ message: err.message });
  }
});

// 3. UPDATE a task (Enhanced for all fields)
router.put('/:id', async (req, res) => {
  try {
    const updateData = {};
    
    // Dynamic update check
    if (req.body.completed !== undefined) updateData.completed = req.body.completed;
    if (req.body.reminder !== undefined) updateData.reminder = req.body.reminder;
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.priority !== undefined) updateData.priority = req.body.priority;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      { $set: updateData }, 
      { new: true, runValidators: true } // runValidators ensures priority is 'Low', 'Medium', or 'High'
    );

    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Task not found" });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;