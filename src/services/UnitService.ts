import Unit, { IUnit } from '../models/UnitModel';
import { Types } from 'mongoose';

class UnitService {
  
  // Create a new unit
  async createUnit(unitData: Partial<IUnit>): Promise<IUnit> {
    const unit = new Unit(unitData);
    return unit.save();
  }

  // Get all units by companyId
  async getUnitsByCompany(companyId?: Types.ObjectId): Promise<IUnit[]> {
    if (!companyId) {
      throw new Error('Company ID is required to fetch units');
    }
    return Unit.find({ companyId })
      .populate('headOfUnit', 'firstName lastName'); // Populate unit head details
  }

  // Get a single unit by companyId and unitId
  async getUnitById(companyId?: Types.ObjectId, unitId?: Types.ObjectId): Promise<IUnit | null> {
    if (!companyId || !unitId) {
      throw new Error('Company ID and Unit ID are required to fetch a unit');
    }
    return Unit.findOne({ companyId, _id: unitId })
      .populate('headOfUnit', 'firstName lastName'); // Populate unit head details
  }

  // Update a unit by companyId and unitId
  async updateUnit(companyId?: Types.ObjectId, unitId?: Types.ObjectId, updateData?: Partial<IUnit>): Promise<IUnit | null> {
    if (!companyId || !unitId) {
      throw new Error('Company ID and Unit ID are required to update a unit');
    }
    return Unit.findOneAndUpdate({ companyId, _id: unitId }, updateData, { new: true });
  }

  // Delete a unit by companyId and unitId
  async deleteUnit(companyId?: Types.ObjectId, unitId?: Types.ObjectId): Promise<IUnit | null> {
    if (!companyId || !unitId) {
      throw new Error('Company ID and Unit ID are required to delete a unit');
    }
    return Unit.findOneAndDelete({ companyId, _id: unitId });
  }
}

export default new UnitService();
