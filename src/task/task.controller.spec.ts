import { Test } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from '../prisma/prisma.service';
import { TaskType } from '@prisma/client';

describe('TaskController', () => {

  let taskController: TaskController
  let taskService: TaskService
  let prismaServiceMock: Partial<PrismaService>;

  prismaServiceMock = {
    task: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService, {
        provide: PrismaService,
        useValue: prismaServiceMock,
      },],
    }).compile();

    taskService = moduleRef.get(TaskService);
    taskController = moduleRef.get(TaskController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockTaskId = "ddbf1a10-bb33-4ca5-9e04-945776078d83"

  const mockCreateTaskInput =
  {
    id: mockTaskId,
    account_id: 123,
    schedule_id: "c73c7d52-de54-4706-a919-57bc218ffe08",
    start_time: new Date(),
    duration: 1000,
    type: TaskType.work
  }

  const mockTaskResult = {
    id: mockTaskId,
    ...mockCreateTaskInput
  }


  describe('getAllTasks', () => {
    it('should return an array of tasks', async () => {
      const result = [mockTaskResult];
      taskService.getAllTasks = jest.fn().mockReturnValueOnce(result);
      expect(await taskController.getAllTasks()).toEqual(result);
    });

    it('should return an array of tasks according to limit', async () => {
      const result = [mockTaskResult];
      const limit = 2
      taskService.getAllTasks = jest.fn().mockReturnValueOnce(result);
      expect(await taskController.getAllTasks(limit)).toEqual(result);
      expect(taskService.getAllTasks).toHaveBeenCalledWith(limit);
    });

    it('should use default limit when limit is not set', async () => {
      const result = [mockTaskResult];
      taskService.getAllTasks = jest.fn().mockReturnValueOnce(result);
      expect(await taskController.getAllTasks()).toEqual(result);
      expect(taskService.getAllTasks).toHaveBeenCalledWith(10);
    });
  })

  describe('getTaskById', () => {
    it('should return task by id', async () => {
      taskService.getTaskById = jest.fn().mockReturnValueOnce(mockTaskResult);
      expect(await taskController.getTaskById(mockTaskId)).toEqual(mockTaskResult);
    });
  });

  describe('createTask', () => {
    it('should return created task', async () => {
      taskService.createTask = jest.fn().mockReturnValueOnce(mockTaskResult);
      expect(await taskController.createTask(mockCreateTaskInput)).toEqual(mockTaskResult);
    })
  })

  describe('deleteTask', () => {
    it('should return delete task', async () => {
      taskService.deleteTask = jest.fn().mockReturnValueOnce(mockTaskResult);
      expect(await taskController.deleteTask(mockTaskId)).toEqual(mockTaskResult);
    })
  })
});
