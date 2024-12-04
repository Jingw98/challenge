import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from '@prisma/client';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { isPrismaError } from '../utils/prisma.utils';
import { PrismaErrorCode } from '../utils/prisma-error-codes.enum';

@Injectable()
export class ScheduleService {
    constructor(private prisma: PrismaService) { }

    async getAllSchedules(limit): Promise<Schedule[]> {
        return this.prisma.schedule.findMany({
            take: limit,
        });
    }

    async getScheduleById(id: string, includeTask: boolean = false): Promise<Schedule> {
        const schedule = await this.prisma.schedule.findUnique({
            where: { id },
            include: { tasks: includeTask },
        });

        if (!schedule) {
            throw new NotFoundException(`Schedule with ID ${id} not found`);
        }
        return schedule;
    }

    async createSchedule(data: CreateScheduleDto): Promise<Schedule> {
        return this.prisma.schedule.create({ data });
    }


    async updateSchedule(id: string, data: UpdateScheduleDto): Promise<Schedule> {
        try {
            return await this.prisma.schedule.update({
                where: { id },
                data,
            });
        } catch (error) {
            if (isPrismaError(error, PrismaErrorCode.RecordNotFound)) {
                throw new NotFoundException(`Schedule with ID ${id} not found`);
            }
            throw error;
        }
    }

    async deleteSchedule(id: string): Promise<Schedule> {
        try {
            return await this.prisma.schedule.delete({
                where: { id },
            });
        } catch (error) {
            if (isPrismaError(error, PrismaErrorCode.RecordNotFound)) {
                throw new NotFoundException(`Schedule with ID ${id} not found`);
            }
            throw error;
        }
    }
}
