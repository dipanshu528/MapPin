const express = require("express");
const router = express.Router();
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const fetchuser = require("../middleware/fetchuser.js");
const { uploadFile } = require('../cloudinary'); // Adjust the path as needed
const Map = require("../modals/Map.js")

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/addpoint", fetchuser,  upload.single('imageURL') ,[    
    body("placeName", "enter a valid place").isLength({ min: 3 }),
    body("description", "enter a description").isLength({min: 1})        
], async (req, res)=>{
    
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      let success = false;

      try {
        const {latitude, longitude, placeName,city, rating, visited, description} = req.body;
        
        const existedPlace = await Map.findOne({ placeName, user: req.user.id });
        if (existedPlace) {
            return res.status(500).json({err:"this place already existed"})
        }
        // const existedPlace = await Map.findOne({ placeName });
        // if (existedPlace) {
        //     return res.status(500).json({err:"this place already existed"})
        // }

        
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({ error: "place image file is required" });
        }

        // Upload the image to Cloudinary
        const placeImage = await uploadFile(imageFile.buffer);
        
        console.log(placeImage);

        const newPoint = new Map({
            user: req.user.id,
            placeName,
            latitude, 
            longitude,
            city,
            imageURL: placeImage.url,
            rating,
            visited,
            description
        });

        const savePoint = await newPoint.save();
        success  = true;

        res.json({success, savePoint});

      } catch (error) {
        console.error(error.message);
        res.status(500).send("error occured at adding map points");
      }
      
})



router.get("/getallpoints", fetchuser, async(req,res)=>{
     try {
      const points = await Map.find({user: req.user.id});
      if(!points){
        return res.status(400).json({ error: "points not get" });
      }
      
      res.json(points);

     } catch (error) {

      console.error(error.message);
      res.status(500).send("points not found");
      
     }
})



router.put("/updatepoint/:id", fetchuser, upload.single('imageURL'), async (req, res) => {
  try {
    const { placeName, city, rating, visited, description } = req.body;

    const newPoint = {};

    if (placeName) newPoint.placeName = placeName;
    if (city) newPoint.city = city;
    if (rating) newPoint.rating = rating;
    if (typeof visited !== 'undefined') newPoint.visited = visited;
    if (description) newPoint.description = description;

    // Handle optional image update
    if (req.file) {
      const placeImage = await uploadFile(req.file.buffer);
      newPoint.imageURL = placeImage.url;
    }

    let point = await Map.findById(req.params.id);
    if (!point) {
      return res.status(400).json({ error: "Point not found" });
    }

    if (point.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    point = await Map.findByIdAndUpdate(req.params.id, { $set: newPoint }, { new: true });

    res.json({ success: true, updatedPoint: point });
    console.log(req.body)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error while updating point");
  }
});




router.delete("/deletepoint/:id", fetchuser, async (req,res)=>{
  try {

   // Find the item by ID and ensure it belongs to the authenticated user
   const point = await Map.findOne({ _id: req.params.id, user: req.user.id });

   if (!point) {
     return res.status(404).json({ error: 'point not found ' });
   }

   // Delete the item
   await Map.findByIdAndDelete(req.params.id);

    res.json({success: "successfuly deleting point"});


    
  } catch (error) {
    console.error(error.message);
      res.status(500).send("not deleting point");
  }
})



module.exports = router;