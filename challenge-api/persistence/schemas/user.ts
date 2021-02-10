import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document{
    id: string;
    avatar: string;
    age: number;
    email: string;
    name: string;
    role: 'admin' | 'user';
    surname: string;
    password?: string;
}

const Schema = mongoose.Schema;

const schema = new Schema({
    id: String,
    avatar: String,
    age: Number,
    email: String,
    name: String,
    role: String,
    surname: String,
    password: {type: String, required: false}
});

export default mongoose.model<IUser>('users', schema);
