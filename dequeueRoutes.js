const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const Store = mongoose.model('Store');
const Queue = mongoose.model('Queue');

const router = express.Router();
router.use(requireAuth);

router.post('/dequeue', async (req, res) => {
    const { authorization, user_agent } = req.headers;
    if(user_agent == "Business"){
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
            user = queue.users_in_queue.shift();
            queue.save();
            res.send(queue.users_in_queue);
        }catch(err){
            res.status(422).send({error: err.message});
        }
    }
});

module.exports = router;