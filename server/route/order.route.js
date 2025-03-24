import { Router } from 'express'
import auth from '../middleware/auth.js'
import { CashOnDeliveryOrderController, deleteOrder, getAllOrders, getOrderById, getOrderDetailsController, paymentController, webhookStripe } from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.get("/order-list",auth,getOrderDetailsController)
orderRouter.get("/", getAllOrders); // Get all orders
orderRouter.get("/:orderId", getOrderById); // Get single order
orderRouter.delete("/:orderId", deleteOrder); // Delete order

export default orderRouter