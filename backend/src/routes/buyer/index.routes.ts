import express from "express";
import isBuyer from "../../middlewares/buyer.middleware";
import {
  signupBuyer,
  getProducts,
  getOrders,
  placeOrder,
} from "../../controllers/buyer/index.controller";
import VerifySchema from "../../middlewares/verify-zod-schema.middleware";
import {
  placeOrderSchema,
  signupBuyerSchema,
} from "../../entity/buyer/index.entity";

const router = express.Router();

router.route("/signup").post(VerifySchema(signupBuyerSchema), signupBuyer);
router.route("/product").get(getProducts);
router.use(isBuyer);

router.route("/order").get(getOrders);
router.route("/order").post(VerifySchema(placeOrderSchema), placeOrder);

export default router;
