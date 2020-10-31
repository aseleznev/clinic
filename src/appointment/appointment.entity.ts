import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';
import { DoctorEntity } from '../doctor/doctor.entity';
import { PatientEntity } from '../patient/patient.entity';
import * as moment from 'moment';

export const dateTransformer: ValueTransformer = {
  from: dbValue => {
    return moment(dbValue)
      .utcOffset(0, true)
      .format('DD.MM.YYYY');
  },
  to: entityValue => {
    return entityValue;
  }
};

export const timeTransformer: ValueTransformer = {
  from: dbValue => {
    return moment(dbValue)
      .utcOffset(0, true)
      .format('HH:mm');
  },
  to: entityValue => {
    return entityValue;
  }
};

@Entity()
export class AppointmentEntity {
  constructor(init?: Partial<AppointmentEntity>) {
    if (init) {
      Object.assign(this, init);
      this.doctor = new DoctorEntity({ id: init.doctor.id });
      this.patient = new PatientEntity({ id: init.patient.id });
    }
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', transformer: dateTransformer })
  appointmentDate: string;

  @Column({ type: 'timestamp without time zone', transformer: timeTransformer })
  startTime: string;

  @Column({ type: 'timestamp without time zone', transformer: timeTransformer })
  endTime: string;

  @ManyToOne(
    () => DoctorEntity,
    doctor => doctor.appointment
  )
  doctor: DoctorEntity;

  @ManyToOne(
    () => PatientEntity,
    patient => patient.appointment
  )
  patient: PatientEntity;
}
