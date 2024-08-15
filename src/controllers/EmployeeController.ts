import { Request, Response, NextFunction } from 'express';
import EmployeeService from '../services/EmployeeService';
import { Types } from 'mongoose';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { IEmployee } from '../models/EmployeeModel';
import CustomError from '../utils/CustomError';
import errors from '../utils/errors';

const pipelineAsync = promisify(pipeline);

class EmployeeController {
  // Create a new employee
  async createEmployee(req: Request, res: Response, next: NextFunction) {
    try {
        const companyId = req.user?.companyIds ? new Types.ObjectId(req.user.companyIds[0]) : undefined;

        if (!companyId) {
            return res.status(400).json({ message: 'No company ID associated with the user.' });
        }

        const {
            firstName, lastName, email, password, role,
            jobTitleId, departmentId, unitId, branchId, managerId,
            dateOfHire, salary, hourlyRate, payType, employmentType,
            probationEndDate, terminationDate, terminationReason
        } = req.body;

        if (!firstName || !lastName || !email || !password || !role) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const employeeData = {
            firstName,
            lastName,
            email,
            password,
            role,
            companyId, // Include companyId here
            jobTitleId: new Types.ObjectId(jobTitleId),
            departmentId: new Types.ObjectId(departmentId),
            unitId: unitId ? new Types.ObjectId(unitId) : undefined,
            branchId: branchId ? new Types.ObjectId(branchId) : undefined,
            managerId: managerId ? new Types.ObjectId(managerId) : undefined,
            dateOfHire,
            salary,
            hourlyRate,
            payType,
            employmentType,
            probationEndDate,
            terminationDate,
            terminationReason,
        };

        const employee = await EmployeeService.createEmployee(companyId, employeeData);

        console.log('Employee created:', employee);

        res.status(201).json(employee);
    } catch (error) {
        next(error);
    }
}

  // Get all employees for a specific company
  async getEmployeesByCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds?.[0];

      if (!companyId) {
        return res.status(400).json({ message: 'No company ID associated with the user.' });
      }

      const employees = await EmployeeService.getEmployeesByCompany(new Types.ObjectId(companyId));
      res.json(employees);
    } catch (error) {
      next(error);
    }
  }

  // Get a specific employee by ID
  async getEmployeeById(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds?.[0];
      const { employeeId } = req.params;

      if (!companyId) {
        return res.status(400).json({ message: 'No company ID associated with the user.' });
      }

      const employee = await EmployeeService.getEmployeeById(new Types.ObjectId(companyId), new Types.ObjectId(employeeId));
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      res.json(employee);
    } catch (error) {
      next(error);
    }
  }

  // Update an existing employee
  async updateEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds?.[0];
      const { employeeId } = req.params;
      const { jobTitleId, departmentId, unitId, branchId, managerId, dateOfHire, salary, hourlyRate, payType, employmentType, probationEndDate, terminationDate, terminationReason } = req.body;
      console.log('Updating employee:', req.body);
      if (!companyId) {
        return res.status(400).json({ message: 'No company ID associated with the user.' });
      }

      const updatedEmployee = await EmployeeService.updateEmployee(
        new Types.ObjectId(companyId),
        new Types.ObjectId(employeeId),
        {
          jobTitleId: jobTitleId ? new Types.ObjectId(jobTitleId) : undefined,
          departmentId: departmentId ? new Types.ObjectId(departmentId) : undefined,
          unitId: unitId ? new Types.ObjectId(unitId) : undefined,
          branchId: branchId ? new Types.ObjectId(branchId) : undefined,
          managerId: managerId ? new Types.ObjectId(managerId) : undefined,
          dateOfHire,
          salary,
          hourlyRate,
          payType,
          employmentType,
          probationEndDate,
          terminationDate,
          terminationReason,
        }
      );
      console.log('Employee updated:', updatedEmployee);

      if (!updatedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      res.json(updatedEmployee);
    } catch (error) {
      next(error);
    }
  }

  // Delete an employee
  async deleteEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds?.[0];
      const { employeeId } = req.params;

      if (!companyId) {
        return res.status(400).json({ message: 'No company ID associated with the user.' });
      }

      const deletedEmployee = await EmployeeService.deleteEmployee(
        new Types.ObjectId(companyId),
        new Types.ObjectId(employeeId)
      );

      if (!deletedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      res.status(204).send(); // No content
    } catch (error) {
      next(error);
    }
  }

  // Validation logic for each row
  // Validation logic for each row
  private validateEmployeeRow(row: any): boolean {
    return row.firstName && row.lastName && row.jobTitleId && row.departmentId && row.dateOfHire;
  }

  // Bulk create employees
  async bulkCreateEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.file) {
        throw new CustomError(errors.UNAUTHORIZED);
      }

      const filePath = path.join(__dirname, '../../uploads', req.file.filename);
      console.log('File path:', filePath);

      const employees: Partial<IEmployee>[] = [];
      const companyId = new mongoose.Types.ObjectId(req.user.companyIds[0]);

      // Process CSV and add employees
      await pipelineAsync(
        fs.createReadStream(filePath),
        csv(),
        async (source: AsyncIterable<any>) => {  // Use arrow function here
          for await (const row of source) {
            if (this.validateEmployeeRow(row)) {  // 'this' now correctly refers to the class instance
              employees.push({
                firstName: row.firstName,
                lastName: row.lastName,
                middleName: row.middleName,
                jobTitleId: new mongoose.Types.ObjectId(row.jobTitleId),
                departmentId: new mongoose.Types.ObjectId(row.departmentId),
                unitId: row.unitId ? new mongoose.Types.ObjectId(row.unitId) : undefined,
                branchId: row.branchId ? new mongoose.Types.ObjectId(row.branchId) : undefined,
                managerId: row.managerId ? new mongoose.Types.ObjectId(row.managerId) : undefined,
                dateOfHire: new Date(row.dateOfHire),
                salary: row.salary ? Number(row.salary) : undefined,
                hourlyRate: row.hourlyRate ? Number(row.hourlyRate) : undefined,
                payType: row.payType,
                employmentType: row.employmentType,
                probationEndDate: row.probationEndDate ? new Date(row.probationEndDate) : undefined,
                terminationDate: row.terminationDate ? new Date(row.terminationDate) : undefined,
                terminationReason: row.terminationReason,
              });
            }
          }
        }
      );

      const createdEmployees = await EmployeeService.bulkCreateEmployees(employees, companyId);
      res.status(201).json(createdEmployees);
    } catch (error) {
      next(error);
    }
  }
}

export default new EmployeeController();
