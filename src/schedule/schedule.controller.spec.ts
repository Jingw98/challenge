import { Test } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { PrismaService } from '../prisma/prisma.service';

describe('ScheduleController', () => {

  let scheduleController: ScheduleController
  let scheduleService: ScheduleService
  let prismaServiceMock: Partial<PrismaService>;

  prismaServiceMock = {
    schedule: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ScheduleController],
      providers: [ScheduleService, {
        provide: PrismaService,
        useValue: prismaServiceMock,
      },],
    }).compile();

    scheduleService = moduleRef.get(ScheduleService);
    scheduleController = moduleRef.get(ScheduleController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockScheduleId = "64f9df80-e3ca-49e7-a7e5-144d314e7d0b"

  const mockCreateScheduleInput =
  {
    account_id: 123,
    agent_id: 999,
    start_time: new Date(),
    end_time: new Date()
  }

  const mockScheduleResult = {
    id: mockScheduleId,
    ...mockCreateScheduleInput
  }


  describe('getAllSchedules', () => {
    it('should return an array of schedules', async () => {
      const result = [mockScheduleResult];
      scheduleService.getAllSchedules = jest.fn().mockReturnValueOnce(result);
      expect(await scheduleController.getAllSchedules()).toEqual(result);
    });

    it('should return an array of schedules according to limit', async () => {
      const result = [mockScheduleResult];
      const limit = 2
      scheduleService.getAllSchedules = jest.fn().mockReturnValueOnce(result);
      expect(await scheduleController.getAllSchedules(limit)).toEqual(result);
      expect(scheduleService.getAllSchedules).toHaveBeenCalledWith(limit);
    });

    it('should use default limit when limit is not set', async () => {
      const result = [mockScheduleResult];
      scheduleService.getAllSchedules = jest.fn().mockReturnValueOnce(result);
      expect(await scheduleController.getAllSchedules()).toEqual(result);
      expect(scheduleService.getAllSchedules).toHaveBeenCalledWith(10);
    });
  })

  describe('getScheduleById', () => {
    it('should return schedule by id', async () => {
      scheduleService.getScheduleById = jest.fn().mockReturnValueOnce(mockScheduleResult);
      expect(await scheduleController.getScheduleById(mockScheduleId)).toEqual(mockScheduleResult);
    });
  });

  describe('createSchedule', () => {
    it('should return created schedule', async () => {
      scheduleService.createSchedule = jest.fn().mockReturnValueOnce(mockScheduleResult);
      expect(await scheduleController.createSchedule(mockCreateScheduleInput)).toEqual(mockScheduleResult);
    })
  })

  describe('deleteSchedule', () => {
    it('should return delete schedule', async () => {
      scheduleService.deleteSchedule = jest.fn().mockReturnValueOnce(mockScheduleResult);
      expect(await scheduleController.deleteSchedule(mockScheduleId)).toEqual(mockScheduleResult);
    })
  })
});
