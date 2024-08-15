import Branch, { IBranch } from '../models/BranchModel';
import { Types } from 'mongoose';

class BranchService {
  async createBranch(data: Partial<IBranch>): Promise<IBranch> {
    const branch = new Branch({
      ...data,
      branchManager: data.branchManager
    });

    console.log('Creating new branch:', branch); // Log the branch before saving
    return branch.save();
  }


// Get all branches for a specific company
async getBranchesByCompany(companyId: Types.ObjectId): Promise<IBranch[]> {
  return Branch.find({ companyId })
    .populate('branchManager', 'firstName lastName') // Populating branchManager with firstName and lastName
    .sort({ branchName: 1 });
}

// Get a single branch by ID
async getBranchById(companyId: Types.ObjectId, branchId: Types.ObjectId): Promise<IBranch | null> {
  return Branch.findOne({ companyId, _id: branchId })
    .populate('branchManager', 'firstName lastName'); // Populating branchManager with firstName and lastName
}

  // Update a branch by ID
  async updateBranch(companyId: Types.ObjectId, branchId: Types.ObjectId, updateData: Partial<IBranch>): Promise<IBranch | null> {
    return Branch.findOneAndUpdate({ companyId, _id: branchId }, updateData, { new: true });
  }

  // Delete a branch by ID
  async deleteBranch(companyId: Types.ObjectId, branchId: Types.ObjectId): Promise<IBranch | null> {
    return Branch.findOneAndDelete({ companyId, _id: branchId });
  }
}

export default new BranchService();
