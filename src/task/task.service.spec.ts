import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma, TaskType } from '@prisma/client';
import { PrismaErrorCode } from '../utils/prisma-error-codes.enum';

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [TaskService, PrismaService],
    }).compile();

    service = moduleRef.get<TaskService>(TaskService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockTaskId = 'ddbf1a10-bb33-4ca5-9e04-945776078d83';

  const mockCreateTaskInput = {
    id: mockTaskId,
    account_id: 123,
    schedule_id: 'c73c7d52-de54-4706-a919-57bc218ffe08',
    start_time: new Date(),
    duration: 1000,
    type: TaskType.work,
  };

  const mockTaskResult = {
    id: mockTaskId,
    ...mockCreateTaskInput,
  };

  describe('getAllTasks', () => {
    it('should return an array of tasks', async () => {
      const result = [mockTaskResult];
      prisma.task.findMany = jest.fn().mockReturnValueOnce(result);
      const tasks = await service.getAllTasks(10);
      expect(prisma.task.findMany).toHaveBeenCalledWith({ take: 10 });
      expect(tasks).toEqual(result);
    });
  });

  describe('getTaskById', () => {
    it('should return a task when it exists', async () => {
      prisma.task.findUnique = jest.fn().mockReturnValueOnce(mockTaskResult);
      const task = await service.getTaskById(mockTaskId);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: mockTaskId },
        include: { schedule: false },
      });
      expect(task).toEqual(mockTaskResult);
    });

    it('should return a task with schedule', async () => {
      prisma.task.findUnique = jest.fn().mockReturnValueOnce(mockTaskResult);
      const task = await service.getTaskById(mockTaskId, true);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: mockTaskId },
        include: { schedule: true },
      });
      expect(task).toEqual(mockTaskResult);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      prisma.task.findUnique = jest.fn().mockReturnValueOnce(null);

      await expect(service.getTaskById(mockTaskId)).rejects.toThrow(
        new NotFoundException(`Task with ID ${mockTaskId} not found`),
      );
    });
  });

  describe('updateTask', () => {
    it('should update and return the updated task', async () => {
      prisma.task.update = jest.fn().mockReturnValueOnce(mockTaskResult);

      const task = await service.updateTask(mockTaskId, mockCreateTaskInput);
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: mockTaskId },
        data: mockCreateTaskInput,
      });
      expect(task).toEqual(mockTaskResult);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      prisma.task.update = jest.fn().mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError('error', {
          code: PrismaErrorCode.RecordNotFound,
          clientVersion: 'any',
        }),
      );

      await expect(
        service.updateTask(mockTaskId, { account_id: 321 }),
      ).rejects.toThrow(
        new NotFoundException(`Task with ID ${mockTaskId} not found`),
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete and return the deleted task', async () => {
      prisma.task.delete = jest.fn().mockResolvedValueOnce(mockTaskResult);

      const task = await service.deleteTask(mockTaskId);
      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: mockTaskId },
      });
      expect(task).toEqual(mockTaskResult);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      prisma.task.delete = jest.fn().mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError('error', {
          code: PrismaErrorCode.RecordNotFound,
          clientVersion: 'any',
        }),
      );

      await expect(service.deleteTask(mockTaskId)).rejects.toThrow(
        new NotFoundException(`Task with ID ${mockTaskId} not found`),
      );
    });
  });
});
