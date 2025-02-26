import createHttpError from "http-errors";
import { UsersCollection } from "../db/models/userSchema.js";
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { SessionsCollection } from "../db/models/sessionSchema.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constans/index.js";
import { getFullNameFromGoogleTokenPayload, validateCode } from "../utils/googleOAuth2.js";

export const registerUser = async (payload)=>{

    const user = await UsersCollection.findOne({email: payload.email});
    if(user) throw createHttpError(409, 'Email is used');
const encryptedPassword = await bcrypt.hash(payload.password,10);

 return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
 });
};


export const loginUser = async (payload) =>{
    const user = await UsersCollection.findOne({email: payload.email});
    if (!user) throw createHttpError(404, 'User not found');

    const isEqual = await bcrypt.compare(payload.password, user.password);

    if (!isEqual){
        throw createHttpError(401, 'Unauthorized');
    }
    await SessionsCollection.deleteMany({ userId: user._id });


    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return await SessionsCollection.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
      refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    });
    };


export const logoutUser = async (sessionId)=>{
await SessionsCollection.deleteOne({ _id: sessionId });
};



  const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return {
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
      refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    };
  };

  export const refreshUsersSession = async ({ sessionId, refreshToken}) => {
const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
});

if(!session) { throw createHttpError(401, 'Session not found');

};
const isSessionTokenExpired =
new Date() > new Date(session.refreshTokenValidUntil);

if (isSessionTokenExpired) {
throw createHttpError(401, 'Session token expired');
}
const newSession = createSession();

await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

return await SessionsCollection.create({
  userId: session.userId,
  ...newSession,
});
  };


export const loginOrSignupWithGoogle = async (code)=>{
const loginTicket = await validateCode(code);
const payload = loginTicket.getPayload();
if(!payload) throw createHttpError(401);


let user = UsersCollection.findOne({
  email: payload.email
});
if(!user){
  const password = await bcrypt.hash(randomBytes(10), 10);
  user = await UsersCollection.create({
    email: payload.email,
   name: getFullNameFromGoogleTokenPayload(payload),
      password,
  });
}
const newSession = createSession();

return await SessionsCollection.create({
  userId: user._id,
  ...newSession,
});
};
