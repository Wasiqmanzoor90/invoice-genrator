import { Types } from 'mongoose';

export interface InvoiceItems {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  action: boolean;
}

export interface Invoice {
  invoiceNumber?: string; // Made optionall
  _id: Types.ObjectId | string;
  company: Company;
  client: Client;
  items: InvoiceItems[];
  issueDate: string;
  dueDate: string;
  taxRate: number;
  notes?: string;
  status?: string; // Made optional
}

export interface Company {
  Name: string;
  Phone: string;
  Email: string;
  Adress: string;
}

export interface Client {
  Name: string;
  Email: string;
  Address: string;
}

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue" | "Cancelled";