const mongoose = require('mongoose');

// 몽고디비 접속
const connect = ()=>{
    if(process.env.NODE_ENV !=='production'){
        mongoose.set('debug',true);
    }
}