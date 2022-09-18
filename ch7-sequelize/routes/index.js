const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.render('sequelize', { users });
        // './views/sequelize.html' 내에 user변수를 처리해줌!
        // views 경로는 app.js에서 nunjucks.config로 이미 지정해놨음!!
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;