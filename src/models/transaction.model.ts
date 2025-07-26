import { Schema, model } from "mongoose";

const transactionSchema = new Schema(
  {
    senderUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    senderWalletId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    receiverUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    receiverWalletId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "GHS",
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    gatewayTransactionId: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const transactionModel = model("Transaction", transactionSchema);

export default transactionModel;
