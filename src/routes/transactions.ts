import { Router } from "express";

import transactionController from "../controllers/transactionController";

const router = Router();

router.post("/p2p-transfer", transactionController.p2pTransfer);

// TODO: dummy implementation
router.post("/deposit", transactionController.deposit);

router.get("/:transactionId", transactionController.getTransaction);

router.get("/user/:userId", transactionController.getUserTransactions);

export default router;
