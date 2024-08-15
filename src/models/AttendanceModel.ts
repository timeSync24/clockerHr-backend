import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendance extends Document {
  companyId: mongoose.Types.ObjectId; // Reference to the Company
  employeeId: mongoose.Types.ObjectId; // Reference to the Employee
  shiftId: mongoose.Types.ObjectId; // Reference to the Shift
  date: Date;
  status: 'Present' | 'Absent' | 'Late';
  remarks?: string; // Any additional remarks about the attendance status
}

const attendanceSchema = new Schema<IAttendance>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  shiftId: { type: Schema.Types.ObjectId, ref: 'Shift', required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true, enum: ['Present', 'Absent', 'Late'] },
  remarks: { type: String },
}, { timestamps: true });

// index on date for faster query performance
attendanceSchema.index({ companyId: 1, employeeId: 1, date: 1 });
attendanceSchema.index({ companyId: 1, shiftId: 1 });

const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);
export default Attendance;
