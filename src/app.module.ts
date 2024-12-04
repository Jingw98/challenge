import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleService } from './schedule/schedule.service';
import { TaskService } from './task/task.service';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [ScheduleModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, ScheduleService, TaskService],
})
export class AppModule {}
