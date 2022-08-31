const express = require('express');
const router = express.Router();

// GET /user 라우터
// router.get('/', (req, res) => {
//     res.send('hello,user');
// });
router.get('/user/:id', function (req, res) {
    console.log(req.params.id, req.query);
})

module.exports = router;
