import * as JWT from "jsonwebtoken";
// import * as dotenv from "dotenv";
// import * as path from "path";
import { FORGET_PASS_TOKEN } from "../global.constants";

// dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const JWTUtils = (function () {
  const createJWT = (data: {}) => {
    // const generateduserid = generator.userid(24);
    const token = JWT.sign({ ...data }, process.env.TOKEN as string);
    return {
      token: token,
    };
  };

  const signInCreate = (userid: string) => {
    const token = JWT.sign({ _id: userid }, process.env.TOKEN as string)
    return {
      token: token,
      userid: userid
    };
  }

  const forgetPasswordCreate = (userid: string) => {
    const token = JWT.sign({ _id: userid }, process.env.TOKEN + FORGET_PASS_TOKEN)
    return {
      token: token,
      userid: userid
    };
  }

  return {
    createJWT,
    signInCreate,
    forgetPasswordCreate
  };
})();

export default JWTUtils;
