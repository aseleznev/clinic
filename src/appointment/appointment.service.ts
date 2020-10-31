import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusDto } from '../common/dto/status.dto';
import { DoctorEntity } from '../doctor/doctor.entity';
import * as moment from 'moment';
import { AppointmentEntity } from './appointment.entity';
import { AppointmentDto } from '../common/dto/appointment.dto';
import { CreateAppointmentDto } from '../common/dto/create-appointment.dto';
import { PatientEntity } from '../patient/patient.entity';
import { WorkTimeService } from '../work-time/work-time.service';
import { WorkTimeEntity } from '../work-time/work-time.entity';
import { IntervalDto } from '../common/dto/interval.dto';
import { WorkTimeDto } from '../common/dto/work-time.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private appointmentRepository: Repository<AppointmentEntity>,
    private readonly workTimeService: WorkTimeService
  ) {}

  async findAll(): Promise<AppointmentDto[]> {
    return await this.appointmentRepository.find({ relations: ['doctor', 'patient'] });
  }

  async findOne(id: number): Promise<AppointmentDto> {
    return await this.appointmentRepository.findOne(id, { relations: ['doctor', 'patient'] });
  }

  async insert(appointment: CreateAppointmentDto): Promise<StatusDto> {
    const doctor = new DoctorEntity({ id: appointment.doctorId });
    const patient = new PatientEntity({ id: appointment.patientId });

    const startTimePattern = `${appointment.appointmentDate} ${appointment.startTime}`;
    const endTimePattern = `${appointment.appointmentDate} ${appointment.endTime}`;

    const startTime = moment(startTimePattern)
      .utcOffset(0, true)
      .format('DD.MM.YYYY HH:mm');
    const endTime = moment(endTimePattern)
      .utcOffset(0, true)
      .format('DD.MM.YYYY HH:mm');

    const appointmentEntity = new AppointmentEntity({
      appointmentDate: appointment.appointmentDate,
      startTime,
      endTime,
      doctor,
      patient
    });
    const appointmentBusy = await this.checkInterval(appointmentEntity);
    if (!appointmentBusy) {
      const workTimeAvailable = await this.checkAvailableWorkTime(appointmentEntity);
      if (workTimeAvailable) {
        const result = await this.appointmentRepository.insert(appointmentEntity);
        if (result && result.identifiers.length) {
          return new StatusDto({ success: true, message: `id:${result.identifiers[0].id}, row saved` });
        } else {
          return new StatusDto({ success: false, message: result.raw });
        }
      } else {
        return new StatusDto({ success: false, message: 'doctors work time is unavailable' });
      }
    } else {
      return new StatusDto({
        success: false,
        message: `appointment exist id:${appointmentBusy.id} doctorId:${appointment.doctorId} patientId:${appointment.patientId} appointmentDate:${appointmentBusy.appointmentDate} startTime:${appointmentBusy.startTime} endTime:${appointmentBusy.endTime}`
      });
    }
  }

  async delete(id: number): Promise<StatusDto> {
    const result = await this.appointmentRepository.delete(id);
    if (result.affected > 0) {
      return new StatusDto({ success: true, message: `id:${id}, row deleted` });
    } else {
      return new StatusDto({ success: false, message: `id:${id}, row does not exist` });
    }
  }

  async checkInterval(appointment: AppointmentEntity): Promise<AppointmentEntity> {
    return await this.appointmentRepository
      .createQueryBuilder('appointment')
      .andWhere('"appointment"."startTime" < :endTime')
      .andWhere('"appointment"."endTime" > :startTime')
      .andWhere('"appointment"."appointmentDate" = :appointmentDate')
      .andWhere('"appointment"."doctorId" = :doctorId')
      .setParameters({ ...appointment, doctorId: appointment.doctor.id })
      .getOne();
  }

  async checkAvailableWorkTime(appointmentEntity): Promise<boolean> {
    const workTime = await this.workTimeService.getAvailableWorkTime(
      new WorkTimeEntity({ ...appointmentEntity, workDate: appointmentEntity.appointmentDate })
    );
    if (workTime.length > 0) {
      const internals = this.connectIntervals(workTime);
      return internals.some(
        interval =>
          moment(appointmentEntity.startTime).isBetween(interval.startTime, interval.endTime, undefined, '[]') &&
          moment(appointmentEntity.endTime).isBetween(interval.startTime, interval.endTime, undefined, '[]')
      );
    }
    return false;
  }

  connectIntervals(workTime: WorkTimeDto[]): IntervalDto[] {
    if (workTime.length === 1) {
      return [
        new IntervalDto({
          startTime: `${workTime[0].workDate} ${workTime[0].startTime}`,
          endTime: `${workTime[0].workDate} ${workTime[0].endTime}`
        })
      ];
    }
    const intervals: IntervalDto[] = workTime.reduce(
      (newArr: IntervalDto[], currentWorkTime: WorkTimeDto, currentIndex: number) => {
        if (currentIndex > 0) {
          if (currentWorkTime.startTime === workTime[currentIndex - 1].endTime) {
            newArr.push(
              new IntervalDto({
                startTime: `${currentWorkTime.workDate} ${workTime[currentIndex - 1].startTime}`,
                endTime: `${currentWorkTime.workDate} ${currentWorkTime.endTime}`
              })
            );
          }
        }
        return newArr;
      },
      []
    );

    return intervals;
  }

  hasRequiredProperties(appointment: CreateAppointmentDto) {
    return (
      appointment.hasOwnProperty('appointmentDate') &&
      appointment.hasOwnProperty('startTime') &&
      appointment.hasOwnProperty('endTime') &&
      appointment.hasOwnProperty('doctorId') &&
      appointment.hasOwnProperty('patientId')
    );
  }
}
