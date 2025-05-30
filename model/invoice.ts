import mongoose from 'mongoose';
const InvoiceItemSchema  = new mongoose.Schema({
    description: String,
    quantity: Number,
    unitPrice: Number,
});



//Company Schema
const CompanySchema = new mongoose.Schema({
    Name: String,
  Phone: String,
  Email: String,
});



//Client Schema
const ClientSchema = new mongoose.Schema({
    Name: String,
    Phone: String,
    Email: String,
})



const InvoiceSchema = new mongoose.Schema({
    company: CompanySchema,
    client: ClientSchema,
    items: [InvoiceItemSchema],
    issueDate: Date,
    dueDate: Date,
    notes: String,
    taxRate: Number,
}, { timestamps: true });
export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
