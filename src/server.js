require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const user = require('../routes/user');
const cors = require('cors');

app.use(express.json());

app.use(cors());

mongoose.set('strictQuery', true);

app.use('/', user);

mongoose.connect(process.env.URI).then(() => {
    
}).catch((error) => {
    console.log(error.message);
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});