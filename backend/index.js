const express = require("express");
const connectToMongo = require("./db");
const app = express();


const port = 4000;

// const cors = require('cors');
app.use(cors({
    origin: "https://mappin-project.netlify.app",
  methods: ["GET","POST", "DELETE"],  
  credentials: true
 }
 ));
app.use(cors());


connectToMongo();
app.use(express.json())

app.use("/api/auth", require("./routes/auth"));
app.use("/api/map", require("./routes/mapPoint"));




app.listen(port , ()=>{
    console.log(`Example app listening on port ${port}`);
})