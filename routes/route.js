import express from 'express';
import User from '../models/user.js'
import multer from 'multer';
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

    const user = new User({
      name,
      email,
      phone,
      image
    });

    await user.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error creating user', error);
    res.status(500).send('Server Error');
  }
});

// Route handler for the homepage
router.get('/', (req, res) => {
  res.render('index',{title:"Home page"});
});
router.get('/add',(req,res)=>{
   res.render('addUsers',{title:"Adduser"});
})
export default router;