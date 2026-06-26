const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const bookSchema = new mongoose.Schema({
    title:{type:String, required:true},
    author:{type:String, required:true},
    genre:{type:String, required:true},
    rate:{type:Number, min:0, max:5},
    publication:{type:Date, required:true}
});

const Book = new mongoose.model('Books', bookSchema);

router.get('/',async (req,res)=>{
    console.log("Getting all!");
    const books = await Book.find({});
    res.status(200).json(books);
});

router.get('/:id', async (req,res)=>{
    const book = await Book.findById(req.params.id);
    res.status(200).json(book);
});

// router.get('/filter', async (req,res)=>{
//     const books = await Book.find({})
// });

router.post('/', async (req,res)=>{
    const {title, author, genre, rate, publication} = req.body;
    await Book.insertOne({title, author, genre, rate, publication});
    res.status(201).json({title, author, genre, rate, publication});
});

router.put('/:id', async (req,res)=>{
    const id = req.params.id;
    const {title, author, genre, rate, publication} = req.body;
    const response = await Book.findOneAndUpdate({_id: id}, {title, author, genre, rate, publication}, {returnDocument:'after'});
    res.status(201).json(response);
});

router.delete('/:id', async (req,res, next)=>{
    try{
        const id = req.params.id;
        const response = await Book.findOneAndDelete({_id: id});
        res.status(200).json(response);
    } catch(err){
        console.error(err);
        next();
    }
});

module.exports = router;