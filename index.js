require('./models/User');
require('./models/Store');
require('./models/Business');
require('./models/queue');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');
const queueRoutes = require('./routes/enqueueRoutes');
const dequeueRoutes = require('./routes/dequeueRoutes');
const bodyParser = require('body-parser');
const requireAuth = require('./middlewares/requireAuth');


app.use(bodyParser.json());
app.use(authRoutes); //request handler
app.use(storeRoutes);
app.use(queueRoutes);
app.use(dequeueRoutes);

const mongoUri = 'mongodb+srv://admin:passwordpassword@cluster0-pvicx.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () =>{
    console.log('connected to mongo instance')
});
mongoose.connection.on('error', (err)=>{
    console.error('Error connecting to mongo', err);
});

app.get('/', requireAuth, (req, res) => {
    try{
    res.send(`Your email: ${req.user.email}`)
    }catch(err){
        res.send(`Your email: ${req.business.email}`)
    }
});

app.listen(3000, () => {
    console.log('Listening on port 3000')
});