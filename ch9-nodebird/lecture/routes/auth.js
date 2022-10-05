const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { isLoggedIn, isNotLoggedIn } = require('../routes/middlewares');

const router = express.Router();

/** router.post('/join',...)
 * 1. req.body로 넘어온 속성이 email,nick,password 인 값 가져오기
 * 2. email값을 통해 db에서 user 찾기
 * 3. user가 있다면 exist담은 error변수를 쿼리스트링으로 리다이렉트
 * 4. 없다면 await bcrypt.hash(password, 12); 를 통해 암호화된 비번 생성
 * 5. email,nick,암호화된 비밀번호 를 통해 user 생성
 * 6. /로 리다이렉트
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

/** router.post('/login',...)
 * 1. passport.authenticate('local')을 통해 전략코드 실행 <= module.exports에서 './localStrategy'이 된 객체를 생성해주면 됨
 * // 전략코드에서는 db를 통해 로컬 유저 확인, 비번 확인 등의 처리 후 done()으로서 결과 반환
 * 2. 전략코드의 결과값 중
 *      - 서버 에러가 있다면 에러 처리
 *      - user가 존재하지 않다면 에러 처리
 * 3. 전략코드가 성공적이었다면 req.login()호출
 *      - 호출 결과값에 에러 존재 시, 에러 처리
 *      - 에러 없다면 리다이렉트
 */
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        } else {
            req.session.destroy();
            res.redirect('/');
        }
    });
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});

module.exports = router;