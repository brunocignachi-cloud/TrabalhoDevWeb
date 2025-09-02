import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    id: { type: String },
    cpf: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true, min: 1 },
    income: { type: Number, required: true },
    location: { type: String, required: true }
  },
  { timestamps: true }
);

const customers = mongoose.model('customers', customerSchema);

export default customers;
