const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Rote files
const authRoutes = require('./routes/auth');
const userRotes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');

let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let cors = require('cors');

//DB Connection
mongoose
	.connect(process.env.DATABASE, {
		useNewUrlParser    : true,
		useUnifiedTopology : true,
		useCreateIndex     : true
	})
	.then(console.log('Database connected!!!'));

const app = express();

const PORT = process.env.PORT || 8000;

// Middlewares
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routes
app.use('/api', authRoutes);
app.use('/api', userRotes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

app.listen(PORT, () => {
	console.log(`server is up and running on port number ${PORT}`);
});
