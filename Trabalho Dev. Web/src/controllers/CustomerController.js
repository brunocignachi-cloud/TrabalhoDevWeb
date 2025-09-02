import customers from "../models/Customer.js";
import creditRules from "../utils/creditRules.js";

// Custom validation error
class ValidationError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "ValidationError";
    this.status = status;
  }
}

// Validate request body
function validatePayload(body) {
  const errors = [];
  const { age, cpf, name, income, location } = body;

  const parsedAge = Number(age);
  const parsedIncome = Number(income);
  const cleanCpf = String(cpf || "").replace(/\D/g, "");

  if (!Number.isInteger(parsedAge) || parsedAge <= 0) {
    errors.push("Campo 'age' deve ser um número inteiro maior que 0");
  }

  if (cleanCpf.length !== 11) {
    errors.push("Campo 'cpf' deve ter exatamente 11 dígitos");
  }

  if (!name || String(name).trim().length === 0) {
    errors.push("Campo 'name' não pode ser vazio");
  }

  if (!location || String(location).trim().length === 0) {
    errors.push("Campo 'location' não pode ser vazio");
  }

  if (Number.isNaN(parsedIncome) || parsedIncome < 0) {
    errors.push("Campo 'income' deve ser um número válido maior ou igual a 0");
  }

  if (errors.length) {
    throw new ValidationError(errors); // mantém array em vez de string
  }

  return {
    age: parsedAge,
    cpf: cleanCpf,
    name: String(name).trim(),
    income: parsedIncome,
    location: String(location).trim(),
  };
}


class CustomerController {
  static async analisarCredito(req, res, next) {
    try {
      const payload = validatePayload(req.body);

      // compute credits
      const loans = creditRules(payload);

      // upsert by cpf
      await customers.findOneAndUpdate(
        { cpf: payload.cpf },
        payload,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const response = {
        customer: payload.name,
        loans,
      };

      // If request came from form (urlencoded) render EJS, else JSON
      const contentType = req.headers["content-type"] || "";
      if (contentType.includes("application/x-www-form-urlencoded") || req.headers.accept?.includes("text/html")) {
        return res.status(200).render("result", { data: response });
      }

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // CRUD for customers (optional for testing)
static async listarClientes(req, res, next) {
  try {
    const listaClientes = await customers.find().lean();

    // Se navegador (HTML), renderiza tela
    if (req.headers.accept?.includes("text/html")) {
      return res.status(200).render("users", { users: listaClientes });
    }

    // Senão, mantém retorno JSON (API)
    res.status(200).json(listaClientes);
  } catch (error) {
    next(error);
  }
}

  static async listarClientePorId(req, res, next) {
    try {
      const id = req.params.id;
      const cliente = await customers.findById(id);
      if (!cliente) return res.status(404).json({ message: "Cliente não encontrado." });
      res.status(200).json(cliente);
    } catch (error) {
      next(error);
    }
  }

  static async cadastrarCliente(req, res, next) {
    try {
      const payload = validatePayload(req.body);
      const novoCliente = await customers.create(payload);
      res.status(201).json(novoCliente);
    } catch (error) {
      next(error);
    }
  }

  static async atualizarCliente(req, res, next) {
    try {
      const id = req.params.id;
      const payload = validatePayload(req.body);
      await customers.findByIdAndUpdate(id, payload);
      res.status(200).json({ message: "Cliente atualizado com sucesso." });
    } catch (error) {
      next(error);
    }
  }

  static async excluirCliente(req, res, next) {
    try {
      const id = req.params.id;
      await customers.findByIdAndDelete(id);
      res.status(200).json({ message: "Cliente excluído com sucesso." });
    } catch (error) {
      next(error);
    }
  }
}

export { ValidationError };
export default CustomerController;
