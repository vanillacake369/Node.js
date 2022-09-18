const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = null;
    res.locals.follerCount = 0;
    res.locals.followingCount = 0;
    res.locals.follwerIdList = [];
    next();
}); // [] is declaring an array. {} is declaring an object.

router.get('/profile', (req, res) => {
    res.render('profile', { title: '내정보-NodeBird' });
});

router.get('/join', (req, res) => {
    res.render('join', { title: '회원가입-NodeBird' });
});

router.get('/', (req, res, next) => {
    const twits = [];
    res.render('main', {
        title: 'NodeBird',
        twits,
    });
});

module.exports = router;