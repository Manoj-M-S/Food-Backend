const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Recipe = require("../models/recipe");




//ROUTE FUNCTION TO GET DATA
router.get("/", (req, res, next) =>{
    Recipe.find().select("name recipe _id").exec().then(recipe =>{      
 
         res.status(200).json(recipe)
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({error: err} )
    })
});

// TO POST
router.post("/",(req, res, next) =>{
    const recipe = new Recipe({ 
        _id:new mongoose.Types.ObjectId(),
        name: req.body.name,
        recipe: req.body.recipe
    });
    recipe.save().then(result =>{
        console.log(result);
        res.status(200).json({
            message: "Recipe Created successfully", result
        });
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({error: err} )
    })

}); 

//get element by id
router.get("/:recipeId",(req, res, next) =>{
       Recipe.findById(req.params.recipeId).exec().then(recipe =>{
            res.status(200).json((recipe))
       })
       .catch(err => {
           console.log(err),
           res.status(500).json({error: err} )
       })
});

//update recipe
router.put("/:recipeId",(req, res, next) =>{
    Recipe.findById(req.params.recipeId).then(recipe =>{
    recipe.name = req.body.name;
    recipe.recipe =req.body.recipe;

    recipe.save()
    .then(() => res.json('Recipe updated!'))
    .catch(err => res.status(400).json('Error: ' + err));

   })
   .catch(err => {
       console.log(err),
       res.status(500).json({error: err} )
   })

});

//delete recipe
router.delete("/:recipeId",(req, res, next) =>{
    const permission = ac.can('basic').deleteOwn('recipe');
    if (permission.granted) {
     const id = req.params.recipeId;
    Recipe.remove({_id : id}).exec().then(() =>
         res.status(200).json('Recipe deleted'
         ))
    .catch(err => {
        console.log(err),
        res.status(500).json({error: err} )
    })
}
else {
    return res.status(401).json({
        error: "You don't have enough permission to perform this action"
    })
}
});

module.exports = router;