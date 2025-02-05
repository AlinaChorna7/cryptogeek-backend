
import { Schema, model } from "mongoose";

const UsersSchema = new Schema(
    {
        email: { type: String, required: true, unique: true }
    },
    { timestamps: true, versionKey: false },
);

export const UsersCollection = model('users', UsersSchema);
