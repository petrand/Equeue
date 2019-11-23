const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const Store = mongoose.model('Store');
const Queue = mongoose.model('Queue');

const router = express.Router();
router.use(requireAuth);

router.get('/stores', async (req, res) => {
    const { authorization, user_agent } = req.headers;
    if(user_agent == 'Business'){
    const stores = await Store.find({businessId: req.business._id});
    res.send(stores);
    }else{
        res.status(401).send({error: 'Please log in as a business'});
    }
});

router.post('/stores', async (req, res) =>{
    const{ nfcId, name, location, users_in_queue} = req.body;
    const { authorization, user_agent } = req.headers;
    if(user_agent == 'Business'){
    
    if (!name || !nfcId || !location){
        return res
            .status(422)
            .send({error : 'You must provide name, nfc, location, queue'});
    }
    try{
    const queue = new Queue({nfcId, users_in_queue, businessId: req.business._id});
    await queue.save();
    const store = new Store({nfcId, name, location, queueId: queue._id, businessId: req.business._id});
    await store.save();
    const queue_updating = await Queue.findOne(
        { _id: queue._id });
    queue_updating.storeId = store._id;
    console.log(queue_updating, 'this is the updated queue');
    //queue = Queue({nfcId, users_in_queue, storeId: store._id, businessId: req.business._id});
    res.send(store);
    } catch(err){
        res.status(422).send({error: err.message});
    }}else{
        res.status(401).send({error: 'Please log in as a business'});
    }
});

module.exports = router;
//allow business to acces current queues
//router.get('/queue', async (req,res) =>{
//    const queue = await Store.find.({req.business._id
//});