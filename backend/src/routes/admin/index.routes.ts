import express from "express";
import isAdmin from "../../middlewares/admin.middleware";
import {
  addAdmin,
  addSeller,
  changeStatus,
  getAdmins,
  getBuyers,
  getDashboardData,
  getOrderDetails,
  getOrders,
  getProducts,
  getSellers,
} from "../../controllers/admin/index.controller";
import VerifySchema from "../../middlewares/verify-zod-schema.middleware";
import { addAdminOrSellerSchema } from "../../entity/admin/index.entity";

const router = express.Router();

router.use(isAdmin);

router
  .route("/")
  .get(getAdmins)
  .post(VerifySchema(addAdminOrSellerSchema), addAdmin);
router.route("/dashboard").get(getDashboardData);
router.route("/order").get(getOrders);
router.route("/product").get(getProducts);
router.route("/buyer").get(getBuyers);

router
  .route("/seller")
  .get(getSellers)
  .post(VerifySchema(addAdminOrSellerSchema), addSeller);

router.route("/order/:orderId").get(getOrderDetails).patch(changeStatus);

export default router;
