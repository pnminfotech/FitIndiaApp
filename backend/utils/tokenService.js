// import jwt from "jsonwebtoken";
// const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// export const generateToken = (userId) => {
//     return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d"});
// };



import jwt from "jsonwebtoken";

const need = (k) => {
  const v = process.env[k];
  if (!v) throw new Error(`${k} is not set`);
  return v;
};

export const generateToken = (userId, opts = {}) => {     // default {}
  const { role = "user", extra = {} } = opts;              // default "user"

  const JWT_SECRET   = need("JWT_SECRET");
  const JWT_ISSUER   = need("JWT_ISSUER");
  const JWT_AUDIENCE = need("JWT_AUDIENCE");

  return jwt.sign(
    { id: userId, role, ...extra },
    JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "7d",
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }
  );
};
