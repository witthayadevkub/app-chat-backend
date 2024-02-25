const path = require("path")
const express = require('express');
const cors = require('cors');
const { readdirSync } = require('fs')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { app, server} = require('./socket/socket')
require('dotenv').config()

// const __dirname = path.resolve();
app.use(cors({ origin: true, credentials: true }));
// app.use(cors())
app.use(express.json())
app.use(cookieParser())


readdirSync('./routes').map((r)=> app.use('/api',require('./routes/'+r)))

// app.use(express.static(path.join(__dirname, "/frontend/dist")));

// app.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// });

app.get("/home", (req, res) => {
      res.json({home: "successfully"})
});
//connect db
const connectDB = async () => {
    try{
        await mongoose.connect( process.env.MONGODB_URL)
        console.log('connected db successfully')
    } catch(err) {
        console.log(err)
    }
}

  connectDB()

  

// const PORT = process.env.PORT || 8000;
const PORT = process.env.PORT || 8000
server.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);
});
