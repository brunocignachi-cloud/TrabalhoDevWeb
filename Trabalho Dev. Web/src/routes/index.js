import express from "express";
import clientes from "./CustomerRoutes.js"; 

const routes = (app) => {
  app.get('/', (req, res) => {
    res.render('index');
  });

  app.use(
    express.json(),
    express.urlencoded({ extended: true }),
    clientes 
  )
}

export default routes
