// src/models/EmployeeNumberSequenceModel.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IEmployeeNumberSequence extends Document {
  companyId: mongoose.Types.ObjectId;
  lastEmployeeNumber: number;
}

const employeeNumberSequenceSchema = new Schema<IEmployeeNumberSequence>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, unique: true },
  lastEmployeeNumber: { type: Number, required: true, default: 0 },
});

const EmployeeNumberSequence = mongoose.model<IEmployeeNumberSequence>('EmployeeNumberSequence', employeeNumberSequenceSchema);
export default EmployeeNumberSequence;
