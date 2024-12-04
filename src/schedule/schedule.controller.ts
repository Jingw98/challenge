import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from '@prisma/client';

@Controller('schedules')
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) { }

    @Get()
    async getAllSchedules(@Query('limit') limit: number = 10): Promise<Schedule[]> {
        return this.scheduleService.getAllSchedules(Number(limit));
    }

    @Get(':id')
    async getScheduleById(@Param('id') id: string): Promise<Schedule> {
        return this.scheduleService.getScheduleById(id);
    }

    @Post()
    async createSchedule(@Body() createScheduleDto: CreateScheduleDto): Promise<Schedule> {
        return this.scheduleService.createSchedule(createScheduleDto);
    }

    @Put(':id')
    async updateSchedule(
        @Param('id') id: string,
        @Body() updateScheduleDto: UpdateScheduleDto,
    ): Promise<Schedule> {
        return this.scheduleService.updateSchedule(id, updateScheduleDto);
    }

    @Delete(':id')
    async deleteSchedule(@Param('id') id: string): Promise<Schedule> {
        return this.scheduleService.deleteSchedule(id);
    }
}
