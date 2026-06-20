const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = 8000;
const booksRouter = require('./books');

mongoose.connect('mongodb://localhost:27017/LibDB')
        .then(()=>console.log('Database connected'))
        .catch((err)=>console.error(err));


app.use(cors({
  origin: 'http://127.0.0.1:5500' 
}));
app.use(express.json());
app.use('/books', booksRouter);

app.use((req,res)=>{
    res.status(404).json({"error":"not found!"});
});

app.listen(PORT);