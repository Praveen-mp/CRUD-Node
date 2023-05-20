import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import {MongoClient} from 'mongodb'
import session from 'express-session';
import routes from './routes/route.js';
dotenv.config();
const app = express()
  const port = 2000||process.env.PORT;
  //Database connection
  app.use('/public', express.static('public'));
// Connection URI
const uri = 'mongodb://127.0.0.1:27017/node-crud';

// const mongoose = require('mongoose');

// Connection URI

// Connect to the MongoDB server
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  
  app.use(express.urlencoded({extended:true}));
  app.use(express.json());
  app.use(
    session({
      secret:"my secret key",
      saveUninitialized:true,
      resave:false,
    })
  );
  app.use((req,res,next)=>{
    res.locals.message=req.session.message
    delete req.session.message
    next();
  })
  //set the ejs template
  app.set('view engine','ejs')
  // app.set('views', path.join(__dirname, 'views'));
  app.use("/",routes)
  app.listen(port,()=>{
     console.log("App started");
  })