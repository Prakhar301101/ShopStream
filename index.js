require('dotenv').config()
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const PORT=process.env.PORT;
const userRoutes=require('./routes/userRoutes');


app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)

app.use(userRoutes);

app.listen(PORT,()=>{
    console.log(`Server is listening on Port:${PORT}`);
})