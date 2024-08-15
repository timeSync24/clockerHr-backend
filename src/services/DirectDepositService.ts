// src/services/DirectDepositService.ts
import { Types } from 'mongoose';
import DirectDeposit, { IDirectDeposit } from '../models/DirectDepositModel';

class DirectDepositService {
  async createDirectDeposit(depositData: Partial<IDirectDeposit>, userId: Types.ObjectId): Promise<IDirectDeposit> {
    const newDeposit = new DirectDeposit({ ...depositData, employeeId: userId });
    return newDeposit.save();
  }

  async getDirectDepositsByCompany(companyId: Types.ObjectId): Promise<IDirectDeposit[]> {
    return DirectDeposit.find({ companyId }).exec();
  }

  async getDirectDepositById(companyId: Types.ObjectId, depositId: Types.ObjectId): Promise<IDirectDeposit | null> {
    return DirectDeposit.findOne({ _id: depositId, companyId }).exec();
  }

  async updateDirectDeposit(companyId: Types.ObjectId, depositId: Types.ObjectId, updateData: Partial<IDirectDeposit>): Promise<IDirectDeposit | null> {
    return DirectDeposit.findOneAndUpdate({ _id: depositId, companyId }, updateData, { new: true }).exec();
  }

  async deleteDirectDeposit(companyId: Types.ObjectId, depositId: Types.ObjectId): Promise<IDirectDeposit | null> {
    return DirectDeposit.findOneAndDelete({ _id: depositId, companyId }).exec();
  }
}

export default new DirectDepositService();
