
import { Schema, model } from "mongoose";

const UsersSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: {type: String, required: true}
    },
    { timestamps: true, versionKey: false },
);

UsersSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
  };
export const UsersCollection = model('users', UsersSchema);
