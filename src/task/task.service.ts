import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { isPrismaError } from 'src/utils/prisma.utils';
import { PrismaErrorCode } from 'src/utils/prisma-error-codes.enum';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) { }

  async getAllTasks(limit: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      take: limit,
    });
  }

  async getTaskById(id: string, includeSchedule: boolean = false): Promise<Task> {
    const task = this.prisma.task.findUnique({
      where: { id },
      include: { schedule: includeSchedule },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data,
    });
  }

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    try {
      return this.prisma.task.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RecordNotFound)) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      throw error;
    }
  }

  async deleteTask(id: string): Promise<Task> {
    try {
      return this.prisma.task.delete({
        where: { id },
      });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RecordNotFound)) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      throw error;
    }
  }
}
