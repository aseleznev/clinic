import { ApiProperty } from '@nestjs/swagger';
import { Gender } from './gender.enum';
import { AppointmentDto } from './appointment.dto';

export class PatientDto {
  constructor(init?: Partial<PatientDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Петров Петр Петрович' })
  name: string;

  @ApiProperty({ example: 43 })
  age: number;

  @ApiProperty({ enum: Gender, enumName: 'Male' })
  gender: Gender;

  @ApiProperty({ example: 1234567 })
  tel: string;

  @ApiProperty({ type: AppointmentDto })
  appointment: AppointmentDto[];
}
