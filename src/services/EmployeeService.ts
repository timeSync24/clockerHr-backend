import Employee, { IEmployee } from '../models/EmployeeModel';
import EmployeeNumberSequence from '../models/EmployeeNumberSequenceModel';
import Department from '../models/DepartmentModel';
import Unit from '../models/UnitModel';
import Branch from '../models/BranchModel';
import { Types } from 'mongoose';

// Define the extended type that includes companyId
type EmployeeWithCompanyId = Partial<IEmployee> & { companyId: Types.ObjectId };

class EmployeeService {
  // Create a new employee
  async createEmployee(companyId: Types.ObjectId, data: Partial<IEmployee>): Promise<IEmployee> {
    const employeeNumber = await this.generateEmployeeNumber(companyId);

    // Add the companyId to the companies array
    const employeeData = {
        ...data,
        employeeNumber,
        companyId,
        companies: [companyId], // Ensure the companyId is added to the companies array
    };

    const employee = new Employee(employeeData);
    await employee.save();

    // Update employee count in related models
    await this.updateEmployeeCount(1, companyId, employee.departmentId, employee.unitId, employee.branchId);

    return employee;
}

  // Helper method to generate a unique employee number for the company
  private async generateEmployeeNumber(companyId: Types.ObjectId): Promise<string> {
    const sequence = await EmployeeNumberSequence.findOneAndUpdate(
      { companyId },
      { $inc: { lastEmployeeNumber: 1 } },
      { new: true, upsert: true } // Create document if it doesn't exist
    );

    const employeeNumber = sequence!.lastEmployeeNumber.toString().padStart(4, '0'); // Zero pad the number, e.g., "0001"
    return `${companyId.toString().slice(-4)}-${employeeNumber}`; // Optional: Prefix with part of companyId
  }

  // Get all employees for a specific company
  async getEmployeesByCompany(companyId: Types.ObjectId): Promise<IEmployee[]> {
    return Employee.find({ companyId })
        .populate('departmentId')  // Populate department details
        .populate('unitId')        // Populate unit details
        .populate('jobTitleId');   // Populate job title details
}

  // Get a single employee by ID (scoped to company)
  async getEmployeeById(companyId: Types.ObjectId, employeeId: Types.ObjectId): Promise<IEmployee | null> {
    return Employee.findOne({ _id: employeeId, companyId })
        .populate('departmentId')  // Populate department details
        .populate('unitId')        // Populate unit details
        .populate('jobTitleId');   // Populate job title details
}


  // Update an existing employee (scoped to company)
  async updateEmployee(
    companyId: Types.ObjectId,
    employeeId: Types.ObjectId,
    data: Partial<IEmployee>
  ): Promise<IEmployee | null> {
    const existingEmployee = await Employee.findOne({ _id: employeeId, companyId });
    if (!existingEmployee) {
      throw new Error('Employee not found');
    }
  
    // Handle employee count adjustments if unit/department/branch is changed
    if (
      (data.departmentId && !data.departmentId.equals(existingEmployee.departmentId)) ||
      (data.unitId && !data.unitId.equals(existingEmployee.unitId)) ||
      (data.branchId && !data.branchId.equals(existingEmployee.branchId))
    ) {
      await this.updateEmployeeCount(-1, companyId, existingEmployee.departmentId, existingEmployee.unitId, existingEmployee.branchId);
      await this.updateEmployeeCount(1, companyId, data.departmentId, data.unitId, data.branchId);
    }
  
    // Merge the existing employee data with the incoming update data
    const updatedEmployeeData = {
      ...existingEmployee.toObject(), // Convert the document to a plain object
      ...data, // Override with new data
      companyId: existingEmployee.companyId, // Preserve the companyId
      employeeNumber: existingEmployee.employeeNumber, // Preserve the employee number
    };
  
    const updatedEmployee = await Employee.findOneAndUpdate({ _id: employeeId, companyId }, updatedEmployeeData, { new: true });
  
    if (!updatedEmployee) {
      throw new Error('Employee not found');
    }
  
    return updatedEmployee;
  }
  
  // Delete an employee (scoped to company)
  async deleteEmployee(companyId: Types.ObjectId, employeeId: Types.ObjectId): Promise<IEmployee | null> {
    const employee = await Employee.findOneAndDelete({ _id: employeeId, companyId });
    if (!employee) {
      throw new Error('Employee not found');
    }

    // Decrease employee count in related models
    await this.updateEmployeeCount(-1, companyId, employee.departmentId, employee.unitId, employee.branchId);

    return employee;
  }

  // Helper method to update employee count in Unit, Department, and Branch (scoped to company)
  private async updateEmployeeCount(
    increment: number,
    companyId: Types.ObjectId,
    departmentId?: Types.ObjectId,
    unitId?: Types.ObjectId,
    branchId?: Types.ObjectId
  ) {
    if (departmentId) {
      await Department.findOneAndUpdate({ _id: departmentId, companyId }, { $inc: { employeeCount: increment } });
    }
    if (unitId) {
      await Unit.findOneAndUpdate({ _id: unitId, companyId }, { $inc: { employeeCount: increment } });
    }
    if (branchId) {
      await Branch.findOneAndUpdate({ _id: branchId, companyId }, { $inc: { employeeCount: increment } });
    }
  }

   // Bulk create employees
   async bulkCreateEmployees(employees: Partial<IEmployee>[], companyId: Types.ObjectId): Promise<IEmployee[]> {
    // Add companyId and generate employeeNumber for each employee
    const employeesWithCompanyId = employees.map(employee => ({
      ...employee,
      companyId: companyId,  // Add the companyId here
    }));

    for (const employee of employeesWithCompanyId) {
      employee.employeeNumber = await this.generateEmployeeNumber(companyId); // Generate employee number
    }

    // Now we can safely insert the employees into the database
    const createdEmployees = await Employee.insertMany(employeesWithCompanyId as IEmployee[]);

    // Optionally, update employee counts in related models (e.g., departments, units, branches)
    for (const employee of createdEmployees) {
      await this.updateEmployeeCount(1, companyId, employee.departmentId, employee.unitId, employee.branchId);
    }

    return createdEmployees;
  }
}

export default new EmployeeService();