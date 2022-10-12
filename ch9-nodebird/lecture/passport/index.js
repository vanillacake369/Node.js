const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 프론트 단에 보낼 때 패스워드 및 개인정보는 최대한 보내지 않게 해야함. -> attributes에는 id와 nick만 추가
  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [{
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followers',
      }, {
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followings',
      }],
    })
      .then(user => done(null, user)) // req.user, req.isAuthenticated() 반환
      .catch(err => done(err));
  });

  local();
  kakao();
};