import { Types } from 'mongoose';
export interface InvoiceItems {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  _id: Types.ObjectId | string;
  company: Company;
  client: Client;
  items: InvoiceItems[];
  issueDate: string;
  dueDate: string;
  taxRate?: number;
  notes?: string;
}


export interface Company
{
  Name: string;
  Phone: string;
  Email: string;
  Adress : string;
}

export interface Client{
  Name: string;
  Email : string;
  Address: string;
}