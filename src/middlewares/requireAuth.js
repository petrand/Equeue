const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Business = mongoose.model('Business');

module.exports = (req,res,next) => {
    const { authorization, user_agent } = req.headers;
    // authorization === 'Bearer sdgsfgsfdh'
    if (!authorization) {
        return res.status(401).send({error: 'U must log in.'});
    }
    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, 'MY_SECRET_KEY', async(err, payload) => {
        if (err) {
            return res.status(401).send({error: 'You must be logged in.'})
        }
        if (user_agent=='Business'){
            const {businessId} = payload;
            const business = await Business.findById(businessId);
            req.business = business;
            next(); 
        }else{
            const {userId} = payload;
            const user = await User.findById(userId);
            req.user = user;
            next(); 
        }
    });
};