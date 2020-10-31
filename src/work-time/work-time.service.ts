import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkTimeDto } from '../common/dto/create-work-time.dto';
import { StatusDto } from '../common/dto/status.dto';
import { WorkTimeEntity } from './work-time.entity';
import { DoctorEntity } from '../doctor/doctor.entity';
import * as moment from 'moment';
import { WorkTimeDto } from '../common/dto/work-time.dto';

@Injectable()
export class WorkTimeService {
  constructor(
    @InjectRepository(WorkTimeEntity)
    private workTimeRepository: Repository<WorkTimeEntity>
  ) {}

  async findAll(): Promise<WorkTimeDto[]> {
    return await this.workTimeRepository.find({ relations: ['doctor'] });
  }

  async findOne(id: number): Promise<WorkTimeDto> {
    return await this.workTimeRepository.findOne(id, { relations: ['doctor'] });
  }

  async insert(workTime: CreateWorkTimeDto): Promise<StatusDto> {
    const doctor = new DoctorEntity({ id: workTime.doctorId });

    const startTimePattern = `${workTime.workDate} ${workTime.startTime}`;
    const endTimePattern = `${workTime.workDate} ${workTime.endTime}`;

    const startTime = moment(startTimePattern)
      .utcOffset(0, true)
      .format('DD.MM.YYYY HH:mm');
    const endTime = moment(endTimePattern)
      .utcOffset(0, true)
      .format('DD.MM.YYYY HH:mm');

    const workTimeEntity = new WorkTimeEntity({
      workDate: workTime.workDate,
      startTime,
      endTime,
      doctor
    });
    const workTimeExist = await this.checkInterval(workTimeEntity);
    if (!workTimeExist) {
      const result = await this.workTimeRepository.insert(workTimeEntity);
      if (result && result.identifiers.length) {
        return new StatusDto({ success: true, message: `id:${result.identifiers[0].id}, row saved` });
      } else {
        return new StatusDto({ success: false, message: result.raw });
      }
    } else {
      return new StatusDto({
        success: false,
        message: `work time exist id:${workTimeExist.id} doctorId:${workTime.doctorId} workDate:${workTimeExist.workDate} startTime:${workTimeExist.startTime} endTime:${workTimeExist.endTime}`
      });
    }
  }

  async delete(id: number): Promise<StatusDto> {
    const result = await this.workTimeRepository.delete(id);
    if (result.affected > 0) {
      return new StatusDto({ success: true, message: `id:${id}, row deleted` });
    } else {
      return new StatusDto({ success: false, message: `id:${id}, row does not exist` });
    }
  }

  async checkInterval(workTime: WorkTimeEntity): Promise<WorkTimeEntity> {
    const result = await this.workTimeRepository
      .createQueryBuilder('workTime')
      .andWhere('"workTime"."startTime" < :endTime')
      .andWhere('"workTime"."endTime" > :startTime')
      .andWhere('"workTime"."workDate" = :workDate')
      .andWhere('"workTime"."doctorId" = :doctorId')
      .setParameters({ ...workTime, doctorId: workTime.doctor.id })
      .getOne();
    return result;
  }

  async getAvailableWorkTime(workTime: WorkTimeEntity): Promise<WorkTimeDto[]> {
    return await this.workTimeRepository
      .createQueryBuilder('workTime')
      .andWhere('"workTime"."startTime" < :endTime')
      .andWhere('"workTime"."endTime" > :startTime')
      .andWhere('"workTime"."workDate" = :workDate')
      .andWhere('"workTime"."doctorId" = :doctorId')
      .orderBy('"workTime"."startTime"', 'ASC')
      .setParameters({ ...workTime, doctorId: workTime.doctor.id })
      .getMany();
  }
}
