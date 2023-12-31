const jwt = require('jsonwebtoken');
const userSchema = require('../schemas/user');

module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;
  const [loginType, loginToken] = (Authorization ?? '').split(' ');

  if (loginType !== 'Bearer' || !loginToken) {
    res.status(403).json({
      errorMessage: '로그인이 필요한 기능입니다.',
    });
    return;
  }

  try {
    const { userId } = jwt.verify(loginToken, 'letsgo-doge-key');
    const user = await userSchema.findById(userId);
    res.locals.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({
      errorMessage: '로그인이 필요한 기능입니다.',
    });
    return;
  }
};
