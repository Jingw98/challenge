import { IsOptional, IsString, IsInt, IsDate, IsEnum } from 'class-validator';
import { TaskType } from '@prisma/client';

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    schedule_id?: string;

    @IsInt()
    @IsOptional()
    account_id?: number;

    @IsDate()
    @IsOptional()
    start_time?: Date;

    @IsInt()
    @IsOptional()
    duration?: number;

    @IsEnum(TaskType)
    @IsOptional()
    type?: TaskType;
}
