import { Router, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import Transaction from "../models/transaction.model";
import {
  depositTransactionValidation,
  p2pTransactionValidation,
} from "../validation/transactionValidation";
import { sendTransactionEvent } from "../kafka/transactionProducer";
import { debitWallet, creditWallet } from "../services/walletApiService";
import { initiatePayment } from "../services/paymentGatewayService";

const router = Router();

router.post("/p2p-transfer", async (req: Request, res: Response) => {
  const payload = req.body;

  const { valid, errors } = p2pTransactionValidation(payload);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  let newTransaction;
  try {
    // initiate transfer and set transaction status as PENDING
    newTransaction = new Transaction({ ...payload, status: "PENDING" });
    await newTransaction.save();
    console.log(
      `P2P transaction ${newTransaction.id} initiated by ${payload.senderUserId}.`
    );

    // debit sender's wallet
    await debitWallet(payload.senderWalletId, payload.amount);
    console.log(
      `Sender wallet ${payload.senderWalletId} debited for transaction ${newTransaction.id}.`
    );

    // update transaction status to DEBITED
    await Transaction.findByIdAndUpdate(
      newTransaction.id,
      { status: "DEBITED" },
      { new: true, useFindAndModify: false }
    );

    // publish event for wallet service to credit receiver's wallet
    await sendTransactionEvent({
      type: "transaction_completed",
      status: "SUCCESS",
      transactionId: newTransaction.id,
      transactionType: "P2P",
      senderUserId: payload.senderUserId,
      senderWalletId: payload.senderWalletId,
      receiverUserId: payload.receiverUserId,
      receiverWalletId: payload.receiverWalletId,
      amount: payload.amount,
      currency: payload.currency,
    });

    // update transaction status to SUCCESS
    await Transaction.findByIdAndUpdate(
      newTransaction.id,
      { status: "SUCCESS" },
      { new: true, useFindAndModify: false }
    );

    console.log(`P2P transaction ${newTransaction.id} completed successfully.`);
    res.status(200).json({
      message: "P2P transfer initiated successfully.",
      transactionId: newTransaction.id,
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(
      `Error processing P2P transfer for transaction ${newTransaction?.id}: ${error.message}`,
      { error }
    );
    const finalStatus =
      error.message === "Insufficient funds"
        ? "FAILED_INSUFFICIENT_FUNDS"
        : "FAILED";
    if (newTransaction?.id) {
      await Transaction.findByIdAndUpdate(
        newTransaction.id,
        { status: finalStatus },
        { new: true, useFindAndModify: false }
      );
    }

    if (newTransaction && newTransaction.status === "DEBITED") {
      console.log(
        `Attempting to reverse debit for transaction ${newTransaction.id} on wallet ${payload.senderWalletId}`
      );
      try {
        await creditWallet(payload.senderWalletId, payload.amount);
        console.log(
          `Successfully reversed debit for transaction ${newTransaction.id}.`
        );
        // Send event for notification service about reversal
      } catch (reversalError) {
        console.log(
          `CRITICAL: Failed to reverse debit for transaction ${newTransaction.id}: ${reversalError.message}`,
          { error: reversalError }
        );
        // Manual intervention required.
      }
    }

    res
      .status(500)
      .json({ message: "Transaction failed", details: error.message });
  }
});

// TODO: dummy implementation
router.post("/deposit", async (req: Request, res: Response) => {
  const payload = req.body;

  const { valid, errors } = depositTransactionValidation(payload);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  let newTransaction;
  try {
    // initiate transfer and set transaction status as PENDING
    newTransaction = new Transaction({ ...payload, status: "PENDING" });
    await newTransaction.save();
    console.log(
      `Deposit transaction ${newTransaction.id} initiated by ${payload.senderUserId}.`
    );

    // initiate payment with external gateway
    const gatewayResponse = await initiatePayment({
      transactionId: newTransaction.id,
      amount: payload.amount,
      currency: payload.currency,
      description: `Deposit to wallet ${payload.walletId}`,
      customerInfo: payload.customerInfo,
      paymentMethod: payload.paymentMethod,
    });

    // update transaction status to PENDING
    await Transaction.findByIdAndUpdate(
      newTransaction.id,
      {
        status: "PENDING_GATEWAY_CONFIRMATION",
        gatewayTransactionId: gatewayResponse.gatewayTransactionId,
      },
      { new: true, useFindAndModify: false }
    );

    // respond to client with gateway redirect URL or status
    console.log(
      `Deposit transaction ${newTransaction.id} sent to gateway. Gateway Ref: ${gatewayResponse.gatewayTransactionId}`
    );
    return res.status(200).json({
      message: "Deposit initiated, awaiting payment confirmation.",
      transactionId: newTransaction.id,
      status: "PENDING_GATEWAY_CONFIRMATION",
      gatewayDetails: gatewayResponse,
    });
  } catch (error) {
    console.log(
      `Error processing deposit for transaction ${newTransaction?.id}: ${error.message}`,
      { error }
    );
    if (newTransaction?.id) {
      await Transaction.findByIdAndUpdate(
        newTransaction.id,
        { status: "FAILED" },
        { new: true, useFindAndModify: false }
      );
    }
    res
      .status(500)
      .json({ message: "Deposit initiation failed", details: error.message });
  }
});

router.get("/:transactionId", async (req: Request, res: Response) => {
  const { transactionId } = req.params;

  try {
    const transaction = await Transaction.findById(transactionId);
    return res.json(transaction);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/user/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const transactions = await Transaction.find({
      senderUserId: userId,
      receiverUserId: userId,
    });
    console.log(
      `Fetched ${transactions.length} transactions for user ${userId}`
    );
    res.json({ transactions });
  } catch (error) {
    console.log(
      `Error fetching transactions for user ${userId}: ${error.message}`,
      { error }
    );
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
