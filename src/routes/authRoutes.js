const express = require('express');
const router = express.Router();
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User')
const Business = mongoose.model('Business');


router.post('/signup', async (req,res)=>{
    const {email, password, is_business} = req.body;
    if (is_business==true){
        try{
            console.log('is a business');
            const business = new Business({email, password, is_business});
            await business.save();
            
            const token = jwt.sign({businessId: business._id},
                'MY_SECRET_KEY');
            console.log(req.body);
            res.send({token});
            } catch(err){
               return res.status(422).send(err.message);
            }
    }else{
        console.log('is not a business');
        const {email, password} = req.body;
        try{
        const user = new User({email, password});
        await user.save();
        
        const token = jwt.sign({userId: user._id},
            'MY_SECRET_KEY');
        console.log(req.body);
        res.send({token});
        } catch(err){
           return res.status(422).send(err.message);
        }
    }


});

router.post('/signin', async (req, res) => {
   
    const {email, password, is_business}= req.body;
    if(!email || !password) {
        return res.status(422).send({error: 'Must provide email and password'});
    }
    if (is_business == false){
        const user = await User.findOne({email});
        if (!user){
            return res.status(422).send({error: 'Invalid password or email'});
        }

        try{
        await user.comparePassword(password);
        const token = jwt.sign({userId: user._id}, 'MY_SECRET_KEY');
        res.send({token});
        } catch(err){
            return res.status(422).send({error: 'Invalid password or email'});
    
        }
    }else{
        const business = await Business.findOne({email});
        if (!business){
            return res.status(422).send({error: 'Invalid password or email'});
        }
    
        try{
        await business.comparePassword(password);
        console.log(req);
        const token = jwt.sign({businessId: business._id}, 'MY_SECRET_KEY');
        res.send({token});
        } catch(err){
            return res.status(422).send({error: 'Invalid password or email'});
        }
    }
    });

module.exports = router;