import express from 'express';

const router = express.Router();

// Route handler for the homepage
router.get('/', (req, res) => {
  res.render('index',{title:"Home page"});
});

export default router;