import { IsInt, IsDate, IsOptional } from 'class-validator';

export class UpdateScheduleDto {
  @IsInt()
  @IsOptional()
  account_id?: number;

  @IsInt()
  @IsOptional()
  agent_id?: number;

  @IsDate()
  @IsOptional()
  start_time?: Date;

  @IsDate()
  @IsOptional()
  end_time?: Date;
}
