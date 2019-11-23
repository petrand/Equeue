const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const Store = mongoose.model('Store');
const Queue = mongoose.model('Queue');

const router = express.Router();
router.use(requireAuth);



router.post('/enqueue', async (req, res) => {
    const { authorization, user_agent } = req.headers;
    if(user_agent != 'Business'){
    const{nfcId} = req.body;
    //console.log(req);
    if (!nfcId){
        return res
            .status(422)
            .send({error: "Invalid NFC"});
    }
    try{
        const queue = await Queue.findOne(
            { "nfcId": nfcId });
        //console.log(req.user._id);
        //console.log(queue.users_in_queue.includes(req.user._id));
        if (!queue.users_in_queue.includes(req.user._id)){
        queue.users_in_queue.push(req.user._id);
        queue.save();
        res.send(queue.users_in_queue.length.toString());
        }
        else{

        //res.send(queue.users_in_queue.indexOf(req.user._id).toString());
        const index = queue.users_in_queue.indexOf(req.user._id)
        queue.users_in_queue.splice(index, 1);
        queue.save();
        res.send(queue);
    }
        //console.log(queue.users_in_queue, 'this is the updated queue');
        //res.send(queue.users_in_queue);//.length.toString());
    } catch(err){
        res.status(422).send({error: err.message});
    }}else{
        res.status(401).send({error: 'You have to be a customer to enqueue'});
    }
});

router.get('/current_queue', async (req, res) => {
    const { authorization, user_agent } = req.headers;
    if(user_agent == 'Business'){
        const{storeId} = req.body;
    if (!storeId){
            return res
                .status(422)
                .send({error: "Please specify the store"});
        }
    try{
        const store = await Store.findById(storeId);
        console.log(store);
        const queue = await Queue.findById(store.queueId);
        res.send(queue.users_in_queue);
    }catch(err){
        res.status(422).send({error: err.message});
    }
    }
});

module.exports = router;