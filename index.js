import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import {MongoClient} from 'mongodb'
import session from 'express-session';
import routes from './routes/route.js';
import path from 'path';
dotenv.config();
const app = express()
  const port = 2000||process.env.PORT;
  //Database connection
  app.use('/public', express.static('public'));
  app.use(express.static('uploads'));
// Connection URI
const uri = 'mongodb://127.0.0.1:27017/node-crud';

// const mongoose = require('mongoose');

// Connection URI

// Connect to the MongoDB server
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  
  app.use(express.urlencoded({extended:false}));
  app.use(express.json());
  app.use(session({
    secret: 'my secret key', // Replace with your own secret key
    resave: false,
    saveUninitialized: true
  }));
  app.use((req, res, next) => {
    // Check if a flash message is stored in session
    
      res.locals.message = req.session.message; // Make the message available in templates
      delete req.session.message; // Remove the message from session after accessing it
    next();
  });
  app.post('/add', (req, res) => {
    // Check user credentials and log in
    // ...
  
    // Set flash message
    req.session.message = 'Login successful!';
  
    // Redirect to dashboard
    res.redirect('/');
  });
  
  //set the ejs template
  app.set('view engine','ejs')
  app.set('views', path.join(process.cwd(), 'views'));
  app.use("/",routes)
  app.listen(port,()=>{
     console.log("App started");
  })