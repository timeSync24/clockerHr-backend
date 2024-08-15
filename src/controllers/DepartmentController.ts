// src/controllers/DepartmentController.ts
import { Request, Response, NextFunction } from 'express';
import DepartmentService from '../services/DepartmentService';
import { Types } from 'mongoose';

class DepartmentController {
  // Create a new department
  async createDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds;
      const { departmentName, description, headOfDepartment } = req.body;

      const department = await DepartmentService.createDepartment({
        companyId: companyId ? new Types.ObjectId(companyId[0]) : undefined,
        departmentName,
        description,
        headOfDepartment: headOfDepartment ? new Types.ObjectId(headOfDepartment) : undefined,
      });

      res.status(201).json(department);
    } catch (error) {
      next(error);
    }
  }

  // Get all departments for a specific company
  async getDepartments(req: Request, res: Response, next: NextFunction) {
    try {
      const companyIds = req.user?.companyIds; // Assuming companyIds is an array of ObjectIds
      if (!companyIds || companyIds.length === 0) {
        return res.status(400).json({ message: 'No company ID associated with the user.' });
      }

      // Assuming the user is associated with only one company for simplicity.
      const departments = await DepartmentService.getDepartmentsByCompany(new Types.ObjectId(companyIds[0]));
      res.json(departments);
    } catch (error) {
      next(error);
    }
  }

  // Get a specific department by ID and company ID
  async getDepartmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds?.[0]; // Access the company ID from the user object
      const { departmentId } = req.params;

      if (!companyId) {
        return res.status(400).json({ message: 'No company ID associated with the user.' });
      }

      const department = await DepartmentService.getDepartmentById(
        new Types.ObjectId(companyId),
        new Types.ObjectId(departmentId)
      );
      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }
      res.json(department);
    } catch (error) {
      next(error);
    }
  }

  // Update a specific department by ID and company ID
  async updateDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds?.[0]; // Access the company ID from the user object
      const { departmentId } = req.params;
      const { departmentName, description, headOfDepartment } = req.body;

      if (!companyId) {
        return res.status(400).json({ message: 'No company ID associated with the user.' });
      }

      const updatedDepartment = await DepartmentService.updateDepartment(
        new Types.ObjectId(companyId),
        new Types.ObjectId(departmentId),
        {
          departmentName,
          description,
          headOfDepartment: headOfDepartment ? new Types.ObjectId(headOfDepartment) : undefined,
        }
      );
      if (!updatedDepartment) {
        return res.status(404).json({ message: 'Department not found' });
      }
      res.json(updatedDepartment);
    } catch (error) {
      next(error);
    }
  }

  // Delete a specific department by ID and company ID
  async deleteDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds?.[0]; // Access the company ID from the user object
      const { departmentId } = req.params;

      if (!companyId) {
        return res.status(400).json({ message: 'No company ID associated with the user.' });
      }

      const deletedDepartment = await DepartmentService.deleteDepartment(
        new Types.ObjectId(companyId),
        new Types.ObjectId(departmentId)
      );
      if (!deletedDepartment) {
        return res.status(404).json({ message: 'Department not found' });
      }
      res.status(204).send(); // No content
    } catch (error) {
      next(error);
    }
  }
}

export default new DepartmentController();
