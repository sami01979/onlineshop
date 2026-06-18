import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    endpoint: { type: String, required: true, unique: true },
    keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true }
    }
})

const subscriptionModel = mongoose.models.subscription || mongoose.model('subscription', subscriptionSchema);

export default subscriptionModel;