import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkTimeEntity } from '../work-time/work-time.entity';
import { AppointmentEntity } from '../appointment/appointment.entity';

@Entity()
export class DoctorEntity {
  constructor(init?: Partial<DoctorEntity>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  speciality: string;

  @OneToMany(
    () => WorkTimeEntity,
    workTime => workTime.doctor
  )
  workTime: WorkTimeEntity[];

  @OneToMany(
    () => AppointmentEntity,
    appointment => appointment.doctor
  )
  appointment: AppointmentEntity[];
}
