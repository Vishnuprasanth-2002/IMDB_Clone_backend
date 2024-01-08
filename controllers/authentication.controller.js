const { models } = require("../config/sequelize-config");

const otpVerificationController = async (req, res, next) => {
  try {
    const verify = await models.verificationtable.findOne({
      where: {
        user_id: req.params.id,
      },
      logging: true,
    });
    if (verify) {
      if (verify.otp === req.body.otp) {
        if (verify.expiresAt < new Date().getTime()) {
          const deleteotp = await models.verificationtable.destroy({
            where: { user_id: req.params.id },
            returning: true,
          });
          return next({
            status: 400,
            message: "otp expired",
          });
        }
        const deleteotp = await models.verificationtable.destroy({
          where: { user_id: req.params.id },
          returning: true,
        });
        res.json("success");
      } else {
        return next({
          status: 400,
          message: "otp not match",
        });
      }
    } else {
      return next({
        status: 400,
        message: "otp not generated",
      });
    }
  } catch (error) {
    console.log("\n error...", error);
    return res.json(error);
  }
};
const setNewPasswordController = async (req, res, next) => {
  try {
    const updatedPassword = await models.users.update(
      {
        user_password: req.body.new_password,
      },
      {
        where: { user_id: req.params.id },
        returning: true,
        individualHooks: true,
      }
    );
    res.json({
      message: "Password Updated Successfully",
    });
  } catch (error) {
    return next({
      status: 400,
      message: error.message,
    });
  }
};

module.exports = {
  otpVerificationController,
  setNewPasswordController,
};
