const passport = require('passport');
// what the hell is passport-local.Strategy
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    passport.user(new LocalStrategy({
        usernameField: 'email', // req.body.email
        passwordField: 'password', // req.body.password
    }, async (email, password, done) => { // usernameFieldm,passwordField,done()이 인수값으로 들어감
        try {
            const exUser = await User.findOne({ where: { email } });
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};


// passport.user()??
// LocalStrategy()??
// 첫번째 인자?
// 두번째 인자??
// done()??
// message??


/**
 * 나는 저기 저 passport.user도 이해가 안 되고
 * async(email,password,done)
 */

/**
 * done()
 * - 첫 인자 : 서버 에러
 * - 두번째 : 성공한 경우 (false이면 로그인 실패)
 * - 세번째 : 로그인 실패했을 때 메세지
 * 
 * done()이 호출되면 auth.js로 돌아감
 */