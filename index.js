const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser')
const DB = require("./dbConnection/connection")
//user Routes
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog')
const { compile } = require('ejs');

//connecting database
DB()

//setting view
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.resolve('./views'));

//middlewares
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.use('/blog',blogRoute)
app.use('/', userRoute);

app.listen(8000, () => {
    console.log('Server started');
});
  