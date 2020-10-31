import { ApiProperty } from '@nestjs/swagger';
import { DoctorDto } from './doctor.dto';
import { PatientDto } from './patient.dto';

export class AppointmentDto {
  constructor(init?: Partial<AppointmentDto>) {
    if (init) {
      Object.assign(this, init);
      this.doctor = new DoctorDto(init.doctor);
      this.patient = new PatientDto(init.patient);
    }
  }
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '01.01.2020' })
  appointmentDate: string;

  @ApiProperty({ example: '08:00' })
  startTime: string;

  @ApiProperty({ example: '12:00' })
  endTime: string;

  @ApiProperty({ type: DoctorDto })
  doctor: DoctorDto;

  @ApiProperty({ type: PatientDto })
  patient: PatientDto;
}
