const express = require('express');
const path = require('path');
const app = express();
const DB = require("./dbConnection/connection")
//user Routes
const userRoute = require('./routes/user');
const { compile } = require('ejs');

//connecting database
DB()

//setting view
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json())


app.use('/', userRoute);

app.listen(8000, () => {
    console.log('Server started');
});
  