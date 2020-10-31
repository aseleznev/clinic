import { Module } from '@nestjs/common';
import { WorkTimeService } from './work-time.service';
import { WorkTimeController } from './work-time.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkTimeEntity } from './work-time.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkTimeEntity])],
  providers: [WorkTimeService],
  controllers: [WorkTimeController],
  exports: [WorkTimeService]
})
export class WorkTimeModule {}
