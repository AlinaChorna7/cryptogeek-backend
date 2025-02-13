import { loginUser, logoutUser, refreshUsersSession, registerUser,loginOrSignupWithGoogle } from "../servises/auth.js";
import { ONE_DAY } from "../constans/index.js";
import {generateAuthUrl} from '../utils/googleOAuth2.js';



export const registerUserController = async (req, res)=>{
const user = await registerUser(req.body);

res.status(201).json({
status: 201,
message: 'User was successfully created',
data: user
});
};
export const loginUserController = async (req, res)=>{
    const session = await loginUser(req.body);

    res.cookie('refreshToken', session.refreshToken,{
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });

    res.cookie('sessionId', session._id,{
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });

    res.json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: {
          accessToken: session.accessToken,
        },
      });
    };
export const logoutUserController = async (req, res)=>{
if(req.cookies.sessionId){
await logoutUser(req.cookies.sessionId);

res.clearCookie('sessionId');
res.clearCookie('refreshToken');

res.status(204).send();
};
};


const setupSession = (res, session) =>{
res.cookie('refreshToken', session.refreshToken,{
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
});

res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
});
};

export const refreshUsersSessionController = async (req, res) =>{

    const session = await refreshUsersSession({
sessionId: req.cookies.sessionId,
refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session);

    res.status(200).json({
        status: 200,
        message: 'Session was successfully refreshed',
        data: {
            accessToken: session.accessToken,
        },
    });

};


export const getGoogleAuthURLController = async (req, res)=>{
const url = generateAuthUrl();
res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data:{
        url,
    }
});
};


export const loginWithGoogleController = async (req, res)=>{

const session = await loginOrSignupWithGoogle(req.body.code);
setupSession(res, session);

res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data:{
        accessToken: session.accessToken
    },
});

};
