const express = require('express');
const router = express.Router();

// res.locals 변수를 통해 rendering page의 변수에 값 대입
router.use((req, res, next) => {
    res.locals.user = null;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = [];
    next();
});// [] is declaring an array. {} is declaring an object.

// 각 요청에 대한 렌더링 지정
// title : 브라우저 탭에 표시되는 텍스트 지정
router.get('/profile', (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', (req, res) => {
    res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', (req, res, next) => {
    const twits = [];
    res.render('main', {
        title: 'NodeBird',
        twits,
    });
});

// Export express.Router()
module.exports = router;