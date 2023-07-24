const router = require('express').Router();


// @route   GET api/user
// @desc    Get user list
// @access  Public
router.get('/', (req, res) => {
  // res.send('user route'); // retrutn static file

  res.status(200).json({
    data: 'tony'
  })
})

module.exports = router;