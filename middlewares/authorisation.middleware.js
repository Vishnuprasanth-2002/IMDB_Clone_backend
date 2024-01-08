const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const config = require("../config/config");

module.exports = {
  isAuthorised: async (req, res, next) => {
    try {
      let token = req.headers.Authorization || req.headers.authorization;
      if (token) {
        token = token.substr("Bearer ".length);
        const decoded = await jwt.verify(token, config.jwtSecret);
        if (!decoded) {
          return res.status(401).json("unauthorised not decoded");
        }
        req.decoded = decoded;
        return next();
      }
      return res.status(401).json("unauthorised no token");
    } catch (error) {
      console.log("\n isAuthorised error...", error);
      return res.status(401).json("unauthorised");
    }
  },
  multerupload: (destinationPath) => {
    const fileStoragePath = config.fileSavePath
      ? config.fileSavePath + (config.fileSavePath.endsWith("/") ? "" : "/")
      : "uploads/";
    const directoryOut = "/../";
    const fileServerPath = __dirname + directoryOut + fileStoragePath;
    const filePath = fileServerPath + destinationPath;
    const folderExists = fs.existsSync(filePath);
    const splitFilePath = (fileStoragePath + destinationPath).split("/");
    let writeFilePath = "";
    if (!folderExists) {
      for (const iterator of splitFilePath) {
        if (iterator) {
          if (writeFilePath) {
            writeFilePath += "/" + iterator;
          } else {
            writeFilePath = iterator;
          }
          if (!fs.existsSync(__dirname + directoryOut + writeFilePath)) {
            fs.mkdirSync(__dirname + directoryOut + writeFilePath);
          }
        }
      }
    } else {
      writeFilePath = filePath;
    }
    destinationPath = writeFilePath;

    return multer({
      //multer settings
      storage: multer.diskStorage({
        //multers disk storage settings
        destination: function (req, file, cb) {
          cb(null, writeFilePath); //image storage path
        },
        filename: function (req, file, cb) {
          const fileExist = fs.existsSync(
            writeFilePath + "/" + file.originalname
          ); // checks file existence
          if (fileExist) {
            const orgFileName = file.originalname.split(".");
            cb(
              null,
              orgFileName[0].replace(/ /g, "") +
                "-" +
                Date.now() +
                "." +
                orgFileName[orgFileName.length - 1]
            ); // if efile exists appending date
          } else {
            cb(null, file.originalname);
          }
        },
      }),
    });
  },
};
