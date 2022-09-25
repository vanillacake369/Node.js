const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('../../passport');

const router = express.Router();

/**
        * 그래 select문으로 user를 쿼리해보고 없으면 쿼리스트링error에 exist를 던지는 건 알겠는데
        * ***error 쿼리스트링을 파싱해서 error 핸들링하는 라우터는 어디에 있냐??***
        * => 프론트에서 리다이렉트 되어진 url을 받을 때 error에 대한 쿼리스트링 있을 시 처리하게끔 만듬!
           * views/join.html
           * <script>
               window.onload = () => {
                   if (new URL(location.href).searchParams.get('error')) {
                       alert('이미 존재하는 이메일입니다.');
                   }
               };
           </script>
        */

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        // authError : done()의 첫 인자인 서버에러
        // user : done()의 두 번째 인자인 로그인이 성공한 경우
        // info : done()의 세 번째 인자인 로그인 실패 시 메세지
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect('/?loginError=${info.message}');
        }
        // req.login()하는 순간 passport/index.js 실행 : seriallizeUser() 호출
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); //미들웨어 내 미들웨어에는 (req,res,next)를 붙임!!
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout(); // 세션-쿠키를 서버에서 지워버림
    req.session.destroy(); // 세션 자체를 destroy
    res.redirect('/');  // 다시 홈페이지로
})