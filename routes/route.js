import express from 'express';
import User from '../models/users.js'
import multer from 'multer';
import fs from 'fs'
import { name } from 'ejs';
const router = express.Router();
var storage = multer.diskStorage({
  destination:function(req,file,cb){
       cb(null,"uploads/")
  },
  filename:function(req,file,cb){
    cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
  }
})
var upload=multer({
  storage:storage,
}).single('image')

//database route 
router.post('/add', upload, async function (req, res) {
  try {
    const { name, email, phone } = req.body;
    const image = req.file.filename;
    console.log(req.body.name);
    const users = new User({
      name,
      email,
      phone,
      image
    });
    await users.save();
    
    // res.redirect('/');
    req.session.message = 'Login successful!';

  // Redirect to dashboard
  res.redirect('/');
  } catch (error) {
    console.error('Error creating user', error);
    res.status(500).send('Server Error');
  }
});

// Route handler for the homepage
router.get('/', (req, res) => {
  User.find().exec()
  .then((users) => {
    // Handle the query result here
    res.render("index",{
      title:"Home page",
      users:users
    })
  })
  .catch((error) => {
    // Handle any errors that occur during the query
    console.error(error);
  });
});

router.get('/add',(req,res)=>{
   res.render('addUsers',{title:"Adduser"});
})
router.get('/edit/:id',(req,res)=>{
  let id=req.params.id
  User.findById(id).exec()
  .then((user)=>{
    res.render("editUser",{
      title:"Edit the details",
      user:user
    })
   
  })
  .catch((error) => {
    // Handle any errors that occur during the query
    console.error(error);
  });
})
router.post('/update/:id',upload,(req,res)=>{
   let id=req.params.id;
   let new_img = '';
   if(req.file){
    new_img=req.file.filename;
    try{
      fs.unlinkSync('./uploads'+req.body.old_image)
    }catch(err){
       console.log(err);
    } 
   }else{
      new_img=req.body.old_image
   }
  User.findByIdAndUpdate(id,{
     name:req.body.name,
     email:req.body.email,
     phone:req.body.phone,
     image:req.body.image
  }).exec()
  .then((user)=>{
      
      req.session.message={
        type:'success',
        message:'User updated successfully'
      }
      
      res.redirect("/");
  })
  .catch((err)=>{
    console.log(err);
  })
})
router.get('/delete/:id',(req,res)=>{
   let id = req.params.id;
   User.findByIdAndRemove(id).exec()
   
   .then((result,err)=>{
    if(result.image){
      try{
        fs.unlinkSync('./uploads'+result.image)
      }catch(err){
         console.log(err);
      } 
     }
     if(err){
       res.json({message:err.message})
     }else{
      req.session.message={
        type:'info',
        message:'User deleted successfully'
      }
      res.redirect("/")
     }
   })
})
export default router;