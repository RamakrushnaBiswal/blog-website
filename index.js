// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { connect } = require('http2');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blog');
if(mongoose.connect){
console.log("Connected to MongoDB");
}
else{
    console.error();
}
// Define Post schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model('Post', postSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes
app.get('/', async (req, res) => {
    const posts = await Post.find();
    res.render('index', { posts });
});

app.get('/newpost', (req, res) => {
    res.render('newpost');
});

app.post('/newpost', async (req, res) => {
    const { title, content } = req.body;
    const newPost = new Post({ title, content });
    await newPost.save();
    res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
