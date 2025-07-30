import mongoose from 'mongoose';

// Invoice item sub-schema
const InvoiceItemSchema = new mongoose.Schema({
  description: String,
  quantity: Number,
  unitPrice: Number,
  total: Number,
  action: Boolean,
});

// Company sub-schema
const CompanySchema = new mongoose.Schema({
  Name: String,
  Phone: String,
  Email: String,
  Adress: String,
});

// Client sub-schema
const ClientSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  Address: String,
});

// Main invoice schema
const InvoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientUser',
      required: true,
    },
    invoiceNumber: {
      type: String,
      unique: true,
      default: () => {
        // Generate a random 6-digit number prefixed with INV-
        return `INV-${Math.floor(100000 + Math.random() * 900000)}`;
      },
    },
    company: CompanySchema,
    client: ClientSchema,
    items: [InvoiceItemSchema],
    issueDate: Date,
    dueDate: Date,
    notes: String,
    taxRate: Number,
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Cancelled', 'Overdue'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

// Export model
export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
