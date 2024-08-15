import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeLog extends Document {
  companyId: mongoose.Types.ObjectId; // Reference to the Company
  employeeId: mongoose.Types.ObjectId; // Reference to the Employee
  shiftId: mongoose.Types.ObjectId; // Reference to the Shift
  clockInTime: Date;
  clockOutTime?: Date; // Optional, in case the employee hasn't clocked out yet
  totalHoursWorked?: number; // Calculated based on clock-in and clock-out times
}

const timeLogSchema = new Schema<ITimeLog>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  shiftId: { type: Schema.Types.ObjectId, ref: 'Shift', required: true },
  clockInTime: { type: Date, required: true },
  clockOutTime: { type: Date },
  totalHoursWorked: { type: Number }, // Calculated field
}, { timestamps: true });

// Pre-save middleware for validation
timeLogSchema.pre('save', function (next) {
  const timeLog = this as ITimeLog;

  // Validate that clockOutTime is after clockInTime
  if (timeLog.clockOutTime && timeLog.clockOutTime <= timeLog.clockInTime) {
    return next(new Error('clockOutTime must be after clockInTime'));
  }

  // Calculate total hours worked if clockOutTime is set
  if (timeLog.clockOutTime) {
    const duration = (timeLog.clockOutTime.getTime() - timeLog.clockInTime.getTime()) / (1000 * 60 * 60); // Convert ms to hours
    timeLog.totalHoursWorked = duration;
  }

  next();
});

const TimeLog = mongoose.model<ITimeLog>('TimeLog', timeLogSchema);
export default TimeLog;
