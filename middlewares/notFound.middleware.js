const notfound = (req, res, next) => {
  next({
    status: 400,
    message: "page not found",
  });
};

module.exports = { notfound };
