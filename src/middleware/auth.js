const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token = req.cookies.token; // <--- from cookie

  if (!token) {
    console.log("no token");
    
    return res.redirect("/index-view"); // or res.status(401)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    console.log("Token verification failed", err);
    return res.redirect("/index-view");
  }
};


const preventAuthAccess = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        return res.redirect("/"); 
      }
    } catch (err) {
    }
  }

  next(); 
};


const preventCache = (req, res, next) => {
  res.set({
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache',
    'Expires': '0',
  });
  next();
};




module.exports = { protect ,preventAuthAccess ,preventCache};
