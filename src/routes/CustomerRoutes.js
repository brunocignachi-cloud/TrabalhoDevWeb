import express from "express";
import CustomerController from "../controllers/CustomerController.js";

const router = express.Router();

// Business endpoint
router.post("/creditos", CustomerController.analisarCredito);

// (Optional) CRUD endpoints
router
  .get("/clientes", CustomerController.listarClientes)
  .get("/clientes/:id", CustomerController.listarClientePorId)
  .post("/clientes", CustomerController.cadastrarCliente)
  .put("/clientes/:id", CustomerController.atualizarCliente)
  .delete("/clientes/:id", CustomerController.excluirCliente);

export default router;
