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
    senderWalletCode: {
      type: String,
    },
    senderWalletUserName: {
      type: String,
    },
    senderWalletUserImage: {
      type: String,
    },
    senderWalletStatus: {
      type: String,
    },
    receiverUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    receiverWalletId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    receiverWalletCode: {
      type: String,
    },
    receiverWalletUserName: {
      type: String,
    },
    receiverWalletUserImage: {
      type: String,
    },
    receiverWalletStatus: {
      type: String,
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
    note: {
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
