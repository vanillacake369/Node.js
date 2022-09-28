const passport = require('passport');
const { User } = require('../lecture/models');
const KakaoStrategy = require('passport-kakao').Strategy;

const user = require('../models/user');

module.exports = () => {
    // request data from kakao dev
    passport.use(new KakaoStrategy({
        // 발급받은 카카오 아이디. 이는 노출되지 않아야 하므로 .env파일에 넣어놓음
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
            // query 'user' from db
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: 'kakao' },
            });
            // if 'user' exists, then login
            if (exUser) {
                done(null, exUser);
            }
            // if 'user' does not exists, then join
            else {
                const newUser = await User.create({
                    email: profile._json && profile._json.kakao_account_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }
    ));
};