const express = require('express');
const router = express.Router();
const List = require('../models/lists');
const checkAuth = require('../middleware/check-auth');


router.post('',checkAuth,(req,res,next)=> {
    const list = new List({
        title: req.body.title,
        content: req.body.content,
        creator: req.userData.userId
    });
    list.save().then(createdList=> {
        res.status(201).json({
            message: 'List added succesfully',
            postId: createdList._id
        }); 
    });
});

router.put('/:id',checkAuth,(req,res,next)=> {
    const list = new List({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        creator: req.userData.userId
    });
    console.log(list)
    List.updateOne({_id: req.params.id,creator: req.userData.userId},list).then(result=>{
        console.log(result)
        
        // res.status(200).json({message: 'Updated succesfully'});
        if(result.matchedCount > 0){
            res.status(200).json({message: 'Updated succesfully'});
        } else {
            res.status(401).json({message: 'Not Authorized'});
        }
        
    });
});

router.get('',(req,res,next)=> {
    List.find().then(documents=> {
        res.status(200).json({
            message: 'posts fetched succesfully',
            lists: documents
        })
    })
   
})

router.get('/:id', (req,res,next)=> {
    List.findById(req.params.id).then(list=> {
        if(list){
            res.status(200).json(list);
        } else {
            res.status(404).json({message: 'List not found'})
        }
    })
})

router.delete('/:id',checkAuth,(req,res,next)=> {
    List.deleteOne({_id:req.params.id, creator: req.userData.userId}).then(result=> {
        console.log(result)
        if(result.deletedCount>0){
            res.status(200).json({message: 'List deleted successfully!'});
        }else {
            res.status(401).json({message: 'Not Authorized!'}); 
        }
        
    })
})

module.exports = router;