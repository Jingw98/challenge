import { IsString, IsInt, IsDate, IsEnum } from 'class-validator';
import { TaskType } from '@prisma/client';

export class CreateTaskDto {
    @IsString()
    schedule_id: string;

    @IsInt()
    account_id: number;

    @IsDate()
    start_time: Date;

    @IsInt()
    duration: number;

    @IsEnum(TaskType)
    type: TaskType;
}
