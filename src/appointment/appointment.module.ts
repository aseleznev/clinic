import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentEntity } from './appointment.entity';
import { WorkTimeModule } from '../work-time/work-time.module';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentEntity]), WorkTimeModule],
  controllers: [AppointmentController],
  providers: [AppointmentService]
})
export class AppointmentModule {}
