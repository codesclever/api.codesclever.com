const express = require('express');
const connectToMongo = require('./dbConnect');
const cors = require('cors') 
const env = require('dotenv')
env.config();


const PORT = 8000;
const HOST = '0.0.0.0'
const app = express();

// For connect to mongodb
connectToMongo();

app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());


// Available API 
app.use('/api/auth',require('./routes/auth'));
app.use('/api/payment',require('./routes/payment'));
app.use('/api/exam',require('./routes/exam'));
console.log(process.env.MONGO_URI);


app.listen(PORT,HOST,()=>{
    console.log('0.0.0.0.'+PORT);
})