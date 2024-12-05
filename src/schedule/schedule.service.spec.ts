import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaErrorCode } from '../utils/prisma-error-codes.enum';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [ScheduleService, PrismaService],
    }).compile();

    service = moduleRef.get<ScheduleService>(ScheduleService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockScheduleId = '64f9df80-e3ca-49e7-a7e5-144d314e7d0b';

  const mockCreateScheduleInput = {
    account_id: 123,
    agent_id: 999,
    start_time: new Date(),
    end_time: new Date(),
  };

  const mockScheduleResult = {
    id: mockScheduleId,
    ...mockCreateScheduleInput,
  };

  describe('getAllSchedules', () => {
    it('should return an array of schedules', async () => {
      const result = [mockScheduleResult];
      prisma.schedule.findMany = jest.fn().mockReturnValueOnce(result);
      const schedules = await service.getAllSchedules(10);
      expect(prisma.schedule.findMany).toHaveBeenCalledWith({ take: 10 });
      expect(schedules).toEqual(result);
    });
  });

  describe('getScheduleById', () => {
    it('should return a schedule when it exists', async () => {
      prisma.schedule.findUnique = jest
        .fn()
        .mockReturnValueOnce(mockScheduleResult);
      const schedule = await service.getScheduleById(mockScheduleId);
      expect(prisma.schedule.findUnique).toHaveBeenCalledWith({
        where: { id: mockScheduleId },
        include: { tasks: false },
      });
      expect(schedule).toEqual(mockScheduleResult);
    });

    it('should return a schedule with task', async () => {
      prisma.schedule.findUnique = jest
        .fn()
        .mockReturnValueOnce(mockScheduleResult);
      const schedule = await service.getScheduleById(mockScheduleId, true);
      expect(prisma.schedule.findUnique).toHaveBeenCalledWith({
        where: { id: mockScheduleId },
        include: { tasks: true },
      });
      expect(schedule).toEqual(mockScheduleResult);
    });

    it('should throw NotFoundException if schedule does not exist', async () => {
      prisma.schedule.findUnique = jest.fn().mockReturnValueOnce(null);

      await expect(service.getScheduleById(mockScheduleId)).rejects.toThrow(
        new NotFoundException(`Schedule with ID ${mockScheduleId} not found`),
      );
    });
  });

  describe('updateSchedule', () => {
    it('should update and return the updated schedule', async () => {
      prisma.schedule.update = jest
        .fn()
        .mockReturnValueOnce(mockScheduleResult);

      const schedule = await service.updateSchedule(
        mockScheduleId,
        mockCreateScheduleInput,
      );
      expect(prisma.schedule.update).toHaveBeenCalledWith({
        where: { id: mockScheduleId },
        data: mockCreateScheduleInput,
      });
      expect(schedule).toEqual(mockScheduleResult);
    });

    it('should throw NotFoundException if schedule does not exist', async () => {
      prisma.schedule.update = jest.fn().mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError('error', {
          code: PrismaErrorCode.RecordNotFound,
          clientVersion: 'any',
        }),
      );

      await expect(
        service.updateSchedule(mockScheduleId, { account_id: 321 }),
      ).rejects.toThrow(
        new NotFoundException(`Schedule with ID ${mockScheduleId} not found`),
      );
    });
  });

  describe('deleteSchedule', () => {
    it('should delete and return the deleted schedule', async () => {
      prisma.schedule.delete = jest
        .fn()
        .mockResolvedValueOnce(mockScheduleResult);

      const schedule = await service.deleteSchedule(mockScheduleId);
      expect(prisma.schedule.delete).toHaveBeenCalledWith({
        where: { id: mockScheduleId },
      });
      expect(schedule).toEqual(mockScheduleResult);
    });

    it('should throw NotFoundException if schedule does not exist', async () => {
      prisma.schedule.delete = jest.fn().mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError('error', {
          code: PrismaErrorCode.RecordNotFound,
          clientVersion: 'any',
        }),
      );

      await expect(service.deleteSchedule(mockScheduleId)).rejects.toThrow(
        new NotFoundException(`Schedule with ID ${mockScheduleId} not found`),
      );
    });
  });
});
