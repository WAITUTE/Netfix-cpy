const jwt = require("jsonwebtoken");

function verify(req, res, next) {
  const autoHeader = req.headers.token;
  if (autoHeader) {
    const token = autoHeader.split(" ")[1]; // split by space character
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        res.status(403).json(token);
        console.log(err);
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    return res.status(401).json("You are not authenticated");
  }
}

module.exports = verify;