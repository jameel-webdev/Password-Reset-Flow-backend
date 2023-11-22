import jwt from "jsonwebtoken"; // this is for hashing user password

export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", //secure means-sites to be in "https"
    sameSite: "strict", //prevent CSRF ATTACKS
    maxAge: 30 * 24 * 60 * 60 * 1000, //maxage at time this cookie expires in seconds
  });
};
