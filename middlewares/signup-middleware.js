const userSchema = require('../schemas/user');

module.exports = async (req, res, next) => {
  const { nickname, password, confirmPassword } = req.body;
  try {
    if (nickname.length <= 3 || !/^[a-zA-Z0-9]+$/.test(nickname)) {
      return res.status(412).json({
        errorMessage:
          '닉네임은 최소 3자 이상이며, 알파벳 대소문자와 숫자로만 구성되어야 합니다.',
      });
    }

    if (password.length <= 3 || password.includes(nickname)) {
      return res.status(412).json({
        errorMessage:
          '패스워드는 최소 4자 이상이어야 하며, 닉네임과 동일한 값을 포함할 수 없습니다.',
      });
    }

    if (password !== confirmPassword) {
      return res
        .status(412)
        .json({ errorMessage: '패스워드가 일치하지 않습니다.' });
    }

    const isExistUser = await userSchema.findOne({ nickname });
    if (isExistUser) {
      return res.status(412).json({ errorMessage: '중복된 닉네임입니다.' });
    }

    next();
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ errorMessage: '요청한 데이터 형식이 올바르지 않습니다.' });
    return;
  }
};