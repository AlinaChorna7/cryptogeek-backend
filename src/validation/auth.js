import Joi from "joi";

export const registerUserSchema= Joi.object({
email: Joi.string().required().email(),
password: Joi.string().required().min(6).max(20),
});


export const loginUserSchema = Joi.object({
email: Joi.string().required().email(),
password: Joi.string().required()
});



export const loginWithGoogleOAuthSchema = Joi.object({
    code: Joi.string().required(),
  });
