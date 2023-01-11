require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const user = require('../routes/user');
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(cookieParser());

app.use(express.json());

mongoose.set('strictQuery', true);

app.use('/', user);

mongoose.connect(process.env.URI).then(() => {
    
}).catch((error) => {
    console.log(error.message);
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});