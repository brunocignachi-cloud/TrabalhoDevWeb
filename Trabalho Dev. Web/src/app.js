import express from "express";
import db from "./config/dbConnect.js";
import routes from "./routes/index.js";
import { ValidationError } from "./controllers/CustomerController.js";

db.on("error", console.log.bind(console, 'Erro de conexão.'))
db.once("open", () => {
    console.log('Conexão com o banco realizada com sucesso.')
})

const app = express();

// View engine EJS
app.set('view engine', 'ejs');
app.set('views', './src/views');

routes(app);

app.use(express.static('public'));

// Custom error handler
// You can expand to handle other error types.
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(err.status || 400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

export default app;
