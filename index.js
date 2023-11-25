// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { connect } = require('http2');
const path = require('path');
const multer = require('multer');


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
    content: String,
    image: String
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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// ... (previous code)

// Routes
app.post('/newpost', upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : ''; // Save the filename if an image was uploaded
    const newPost = new Post({ title, content, image });
    await newPost.save();
    res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
