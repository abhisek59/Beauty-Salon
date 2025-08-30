import mongoose,{Schema} from "mongoose";

const transactionSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export const Transaction = mongoose.model('Transaction', transactionSchema);