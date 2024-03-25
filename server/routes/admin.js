const express = require('express'); 
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 





//setting up the router
router = express.Router(); 

//importting the JWT secret 
const jwtsecret = process.env.JWT 




//the layout for admin page 
const adminLayout = '../views/layouts/admin'; 




//authentication middleware 
const authMiddleware = (req , res , next )=>{
    const token = req.cookies.token ; 

    if(!token){
        res.status(401).json({message : "unAuth"}); 
    }
    const decoded = jwt.verify(token , jwtsecret); 
    req.userID = decoded.userID ; 
    next(); 
}









/*
*GET
*Admin - login page 
*/
router.get(('/admin'), async(req , res)=>{
    try {
        res.render('admin/index' , {layout : adminLayout}); 
    } catch (error) {
        console.log(error); 
    }
}); 







/*
*post
*Admin - login page 
*/
router.post(('/admin'), async(req , res)=>{
    try {

        const {username , password} = req.body ; 
        
        


        const user = await User.findOne({username}) ;
        if(!user){
            res.status(401).json({message : "invalid"}); 
        }




        const isPassValid = await bcrypt.compare(password , user.password);
        if(!isPassValid){
            res.status(401).json({message : "invalid"});
        }




        const token = jwt.sign({userID : user._id} , jwtsecret) ; 
        res.cookie('token' , token ,  {httpOnly: true}); 
        res.redirect('/dashboard'); 
        


        res.render('admin/index' , { layout : adminLayout}); 
    } 
    
    
    catch (error) {
        console.log(error); 
    }
}); 






/*
*GET
*DashBoard
*/
router.get('/dashboard' , authMiddleware, async (req ,res)=>{

    try {
        const data = await Post.find(); 
        res.render('admin/dashboard' , {data ,layout:adminLayout});
    } catch (error) {
        console.log(error); 
    }

})














/*
*post
*Register 
*/
router.post(('/register'), async(req , res)=>{
    try {

        const {username , password} = req.body ; 
        const hashedPassword = await bcrypt.hash(password , 10 ); 



        try {
            const newUser = User.create({username , password:hashedPassword}); 
        } catch (error) {
            console.log("inner / "+error); 
        }


        res.render('admin/index' , { layout : adminLayout}); 
    } catch (error) {
        console.log(error); 
    }
}); 






/*
*GET
*ADDING NEW POST 
*/
router.get('/add-post' , authMiddleware, async (req ,res)=>{

    try {
        res.render('admin/add-post' , {layout : adminLayout});
    } catch (error) {
        console.log(error); 
    }

}); 





/*
*post
*POSTING THE NEW POST 
*/
router.post('/add-post', authMiddleware, async (req, res) => {
    try {
      try {
        const newPost = new Post({
          title: req.body.title,
          body: req.body.body
        });
  
        await Post.create(newPost);
        res.redirect('/dashboard');
      } catch (error) {
        console.log(error);
      }
  
    } catch (error) {
      console.log(error);
    }
  });






  /**
 * PUT /
 * Admin - Create New Post
*/
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
  
      await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now()
      });
  
      res.redirect(`/edit-post/${req.params.id}`);
  
    } catch (error) {
      console.log(error);
    }
  
  });






/**
 * GET
 * EDIT POST
*/

router.get('/edit-post/:id', authMiddleware, async (req, res) => {
  try {

    const data = await Post.findOne({ _id: req.params.id });

    res.render('admin/edit-post', {
      data,
      layout: adminLayout
    })

  } catch (error) {
    console.log(error);
  }

});




/**
 * DELETE
 * DELETE THE POST
*/

router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne( { _id: req.params.id } );
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }

});






/**
 * GET /
 * Admin Logout
*/
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
    res.redirect('/');
 });






module.exports = router ; 