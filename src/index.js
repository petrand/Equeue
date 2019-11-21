require('./models/User');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const requireAuth = require('./middlewares/requireAuth');


app.use(bodyParser.json());
app.use(authRoutes); //request handler

const mongoUri = 'mongodb+srv://admin:passwordpassword@cluster0-pvicx.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true
});
mongoose.connection.on('connected', () =>{
    console.log('connected to mongo instance')
});
mongoose.connection.on('error', (err)=>{
    console.error('Errir connecting to mongo', err);
});

app.get('/', requireAuth, (req, res) => {
    res.send(`Your email: ${req.user.email}`)
});

app.listen(3000, () => {
    console.log('Listening on port 3000')
});