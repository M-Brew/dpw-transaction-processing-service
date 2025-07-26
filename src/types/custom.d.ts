export interface IP2PTransactionDetails {
  senderUserId: string;
  senderWalletId: string;
  receiverUserId: string;
  receiverWalletId: string;
  amount: string;
  currency?: string;
  type: string;
  gatewayTransactionId: string;
  description?: string;
}

export interface IDepositTransactionDetails {
  senderUserId: string;
  senderWalletId: string;
  amount: string;
  currency?: string;
  paymentMethod: string;
  description?: string;
  customerInfo: Record<string, any>;
}

export interface ITransactionEvent {
  transactionId: string;
  type: string;
  status: string;
  transactionType: string;
  senderUserId: string;
  senderWalletId: string;
  receiverUserId: string;
  receiverWalletId: string;
  amount: string;
  currency?: string;
}
