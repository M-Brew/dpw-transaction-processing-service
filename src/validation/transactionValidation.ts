import { isValidObjectId } from "mongoose";

import {
  IDepositTransactionDetails,
  IP2PTransactionDetails,
} from "../types/custom";

const p2pTransactionValidation = (details: IP2PTransactionDetails) => {
  const {
    senderUserId,
    senderWalletId,
    receiverUserId,
    receiverWalletId,
    amount,
    currency,
    type,
  } = details;
  const errors: Record<string, string> = {};

  if (!senderUserId || senderUserId.trim() === "") {
    errors.senderUserId = "Sender user id is required";
  } else {
    if (!isValidObjectId(senderUserId)) {
      errors.senderUserId = "Sender user id should be a valid id";
    }
  }

  if (!senderWalletId || senderWalletId.trim() === "") {
    errors.senderWalletId = "Sender wallet id is required";
  } else {
    if (!isValidObjectId(senderWalletId)) {
      errors.senderWalletId = "Sender wallet id should be a valid id";
    }
  }

  if (!receiverUserId || receiverUserId.trim() === "") {
    errors.receiverUserId = "Receiver user id is required";
  } else {
    if (!isValidObjectId(receiverUserId)) {
      errors.receiverUserId = "Receiver user id should be a valid id";
    }
  }

  if (!receiverWalletId || receiverWalletId.trim() === "") {
    errors.receiverWalletId = "Receiver wallet id is required";
  } else {
    if (!isValidObjectId(receiverWalletId)) {
      errors.receiverWalletId = "Receiver wallet id should be a valid id";
    }
  }

  if (!amount || !parseFloat(amount)) {
    errors.amount = "Amount is required";
  } else {
    if (parseFloat(amount) <= 0) {
      errors.amount = "Amount should be greater than 0";
    }
  }

  if (currency && currency !== "GHS") {
    errors.currency = "Invalid currency";
  }

  if (!type || type.trim() === "") {
    errors.type = "Type is required";
  } else {
    if (!["P2P", "P2M", "Withdrawal", "Deposit"].includes(type)) {
      errors.type = "Invalid type";
    }
  }

  // if (!gatewayTransactionId || gatewayTransactionId.trim() === "") {
  //   errors.gatewayTransactionId = "Gateway transaction id is required";
  // }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

const depositTransactionValidation = (details: IDepositTransactionDetails) => {
  const {
    senderUserId,
    senderWalletId,
    amount,
    currency,
    paymentMethod,
    customerInfo
  } = details;
  const errors: Record<string, string> = {};

  if (!senderUserId || senderUserId.trim() === "") {
    errors.senderUserID = "Sender user id is required";
  } else {
    if (!isValidObjectId(senderUserId)) {
      errors.senderUserID = "Sender user id should be a valid id";
    }
  }

  if (!senderWalletId || senderWalletId.trim() === "") {
    errors.senderWalletID = "Sender wallet id is required";
  } else {
    if (!isValidObjectId(senderWalletId)) {
      errors.senderWalletID = "Sender wallet id should be a valid id";
    }
  }

  if (!amount || !parseFloat(amount)) {
    errors.amount = "Amount is required";
  } else {
    if (parseFloat(amount) < 0) {
      errors.amount = "Amount should be greater than 0";
    }
  }

  if (currency && currency !== "GHS") {
    errors.currency = "Invalid currency";
  }

  if (!paymentMethod || paymentMethod.trim() === "") {
    errors.paymentMethod = "Payment method is required";
  } else {
    if (!["Card", "BankTransfer", "MobileMoney"].includes(paymentMethod)) {
      errors.paymentMethod = "Invalid payment method";
    }
  }

  if (!customerInfo) {
    errors.customerInfo = "Customer information is required";
    // TODO: validate object details
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

export { p2pTransactionValidation, depositTransactionValidation };
