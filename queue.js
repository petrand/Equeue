const mongoose = require('mongoose');

const QueueSchema = new mongoose.Schema({
    businessId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business' 
    },
    storeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store' 
    },
    nfcId:{
        type: String,
        unique: true
    },
    users_in_queue: [{type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'}]
});

mongoose.model('Queue', QueueSchema);