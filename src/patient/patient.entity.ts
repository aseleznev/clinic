import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Gender } from '../common/dto/gender.enum';
import { AppointmentEntity } from '../appointment/appointment.entity';

@Entity()
export class PatientEntity {
  constructor(init?: Partial<PatientEntity>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  gender: Gender;

  @Column()
  tel: string;

  @OneToMany(
    () => AppointmentEntity,
    appointment => appointment.doctor
  )
  appointment: AppointmentEntity[];
}
