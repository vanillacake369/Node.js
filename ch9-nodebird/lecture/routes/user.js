// import express module
const express = require('express');
const { User } = require('../models');

// get isLoggedIn from './middlewares'
// get User from '../models/user'
const isLoggedIn = requier('./middlewares');
const User = require('../models/user');

// get Router object using express.Router()
// ==> 라우터 분리!
const router = express.Router();

// handle 'user/:id/follow' request :: POST
/**
 * 1. 규칙 설정을 잘 해야함 
 *  : ':id'의 사용자가 i)타 사용자를 팔로우를 하는 건지ii)팔로우를 당하는 건지
 * 2. 이 규칙을 문서화하거나 주석화는 게 좋음
 * 3. RESTful 네이밍 컨벤션(Resource 표현방식)을 지킬 것
 *  : *RESTFUL 네이밍 가이드(https://restfulapi.net/resource-naming)에서는 Controller의 경우 resource를 조작하는것이 아닌 직접 function을 실행하는 행위를 나타내기위해 사용하므로, 동사를 사용해도 무방하다고 설명한다.*
 */
router.post('/:id/follow',isLoggedIn,async(req,res,next)=>{
    try{
        const User = await User.findOne({where:{id:req.user.id}});
        if(user){
            await user.addFollowing(parseInt(req.params.id,10));
            res.send('success');
        }else{
            res.status(404).send('no user');
        }
    }catch(error){
        console.error(error);
        next(error);
    }
});

// export Router Object for being used in app.js Router
// ==> 라우터 분리!
module.exports = router;