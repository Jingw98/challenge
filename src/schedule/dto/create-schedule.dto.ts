import { IsInt, IsDate, IsNotEmpty } from 'class-validator';

export class CreateScheduleDto {
  @IsInt()
  @IsNotEmpty()
  account_id: number;

  @IsInt()
  @IsNotEmpty()
  agent_id: number;

  @IsDate()
  @IsNotEmpty()
  start_time: Date;

  @IsDate()
  @IsNotEmpty()
  end_time: Date;
}
