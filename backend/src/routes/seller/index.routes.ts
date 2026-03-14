import express from "express";
import isSeller from "../../middlewares/seller.middleware";
import {
  addProduct,
  getDashboardData,
  getOrderDetails,
  getOrders,
  getProductDetails,
  getProducts,
  removeProduct,
} from "../../controllers/seller/index.controller";
import { upload } from "../../middlewares/multer";

const router = express.Router();

router.use(isSeller);
router
  .route("/product")
  .get(getProducts)
  .post(upload.array("attachments", 10), addProduct);
router.route("/dashboard").get(getDashboardData);
router.route("/order").get(getOrders);
router.route("/order/:orderId").get(getOrderDetails);
router
  .route("/product/:productId")
  // .get(getProductDetails)
  .delete(removeProduct);

export default router;
