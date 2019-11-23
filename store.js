//arequire('./models/User');
const mongoose = require('mongoose');


const StoreSchema = new mongoose.Schema({
    businessId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business' //this is the business owner (ie overarching account)
    },
    nfcId:{
        type: String,
        unique: true
    },
    name:{
        type: String,
        default: ''
    },
    location:[{
        latitude: Number,
        longitude: Number, 
        altitude: Number
    }],
    queueId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Queue'
    }
});

mongoose.model('Store', StoreSchema);