import { Router } from "express";
import { cartManager } from "../main/ManagerSystem/ManagerSystem.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    await cartManager.addCart();
    return res.status(201).send({
      status: "success",
      description: "Se agregó correctamente el carrito",
    });
  } catch (error) {
    return res
      .status(400)
      .send({ status: "failed", description: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    await cartManager.addProduct(parseInt(pid), parseInt(cid));
    return res.status(201).send({
      status: "success",
      description: "Se agregó correctamente el producto al carrito",
    });
  } catch (error) {
    return res
      .status(400)
      .send({ status: "failed", description: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const foundCart = await cartManager.getCartById(parseInt(cid));
    return res.status(200).send(foundCart.products);
  } catch (error) {
    return res
      .status(400)
      .send({ status: "failed", description: error.message });
  }
});

export default router;