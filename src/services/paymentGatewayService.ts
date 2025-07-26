const initiatePayment = async (transactionDetails: ITransactionDetails) => {
  try {
    const response = await fetch("http://payment-gateway-url/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transactionDetails),
    });
    const jsonResponse = await response.json();

    if (jsonResponse.data && jsonResponse.data.status === "success") {
      console.log(
        `Payment initiated with gateway for transaction ${transactionDetails.transactionId}. Gateway Ref: ${jsonResponse.data.gatewayReference}`
      );
      return {
        gatewayTransactionId: jsonResponse.data.gatewayReference,
        redirectUrl: jsonResponse.data.redirectUrl || null, // For web redirects
        status: "PENDING_GATEWAY_CONFIRMATION",
      };
    } else {
      console.log(
        `Gateway initiation failed for transaction ${
          transactionDetails.transactionId
        }: ${JSON.stringify(jsonResponse.data)}`
      );
      throw new Error(
        jsonResponse.data.message || "Payment Gateway initiation failed"
      );
    }
  } catch (error) {
    console.log(
      `Error initiating payment with gateway for transaction ${transactionDetails.transactionId}: ${error.message}`,
      { error: error.response?.data || error.message }
    );
    throw new Error(
      error.response?.data?.message || "Failed to initiate payment with gateway"
    );
  }
};

// TODO: clean this up
interface ITransactionDetails {
  transactionId: string;
  amount: string;
  currency?: string;
  description: string;
  customerInfo: Record<string, any>;
  paymentMethod: string;
}

export { initiatePayment };
