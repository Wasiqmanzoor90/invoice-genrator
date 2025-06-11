import mongoose from "mongoose";

const ClientUser = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});
export default mongoose.models.ClientUser || mongoose.model('ClientUser', ClientUser);