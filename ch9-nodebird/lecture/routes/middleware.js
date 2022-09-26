/**
 * "로그인을 해야지만 접근 가능 작업 여부 판단 함수"
 * 
 * 어떤 작업을 하기 전에, req.isAuthenticated()를 통해 
 * 세션에 user가 저장되어 있는지 판단
 * https://medium.com/@prashantramnyc/node-js-with-passport-authentication-simplified-76ca65ee91e5
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

/**
 * "로그인 한 상태 체크 함수"
 * 
 * 이미 로그인을 했는데 재시도하는 경우와 같은 예외를 처리
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다');
        res.redirect(`/?error=${message}`);
    }
}