import dotenv from "dotenv";
dotenv.config();

const { WALLET_SERVICE_BASE_URL } = process.env;

const debitWallet = async (walletId: string, amount: number) => {
  try {
    const response = await fetch(
      `${WALLET_SERVICE_BASE_URL}/api/wallets/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletId, amount, transactionType: "debit" }),
      }
    );
    const jsonResponse = await response.json();

    console.log(`Successfully debited wallet ${walletId} by ${amount}`);

    return jsonResponse;
  } catch (error) {
    console.log(
      `Error debiting wallet ${walletId} by ${amount}: ${error.message}`,
      { error: error.response?.data || error.message }
    );
    throw new Error(error.response?.data?.message || "Failed to debit wallet");
  }
};

const creditWallet = async (walletId: string, amount: number) => {
  try {
    const response = await fetch(
      `${WALLET_SERVICE_BASE_URL}/api/wallets/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletId, amount, transactionType: "credit" }),
      }
    );
    const jsonResponse = await response.json();

    console.log(`Successfully credited wallet ${walletId} by ${amount}`);

    return jsonResponse;
  } catch (error) {
    console.log(
      `Error crediting wallet ${walletId} by ${amount}: ${error.message}`,
      { error: error.response?.data || error.message }
    );
    throw new Error(error.response?.data?.message || "Failed to credit wallet");
  }
};

const getWalletByUserId = async (userId: string) => {
  try {
    const response = await fetch(
      `${WALLET_SERVICE_BASE_URL}/api/wallets/user/${userId}`
    );
    const jsonResponse = await response.json();

    return jsonResponse;
  } catch (error) {
    console.log(`Error fetching wallet for user ${userId}: ${error.message}`, {
      error: error.response?.data || error.message,
    });
    throw new Error(error.response?.data?.message || "Failed to credit wallet");
  }
};

export { debitWallet, creditWallet, getWalletByUserId };
