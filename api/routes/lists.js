const router = require("express").Router();
const List = require("../models/List");
const verify = require("../verifyToken");

//CREATE

router.post("/", verify, async (req, res) => {
    if ( req.user.isAdmin) {
      const newList = new List(req.body);
      
      try{
        const savedList = await newList.save();
        res.status(201).json(savedList);
      }catch(err){
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you are not allowed");
    }
  });
//DELETE

router.delete("/:id", verify, async (req, res) => {
    if ( req.user.isAdmin) {    
      try{
        await List.findByIdAndDelete(req.params.id);
        res.status(201).json("The List Has Been Deleted...");
      }catch(err){
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you are not allowed");
    }
  });

 //GET

 router.get("/", async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];

    try {
        let pipeline = [{ $sample: { size: 10 } }];
        if (typeQuery) {
        pipeline.push({ $match: { type: typeQuery } });
        }
        if (genreQuery) {
        pipeline.push({ $match: { genre: genreQuery } });
        }
        list = await List.aggregate(pipeline);
        res.status(200).json(list);
    }catch(err){
        res.status(500).json(err);
        console.log(err)
        console.log("very bad")
    }
 });
  
  


module.exports = router;