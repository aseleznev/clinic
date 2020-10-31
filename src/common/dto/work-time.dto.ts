import { ApiProperty } from '@nestjs/swagger';
import { DoctorDto } from './doctor.dto';

export class WorkTimeDto {
  constructor(init?: Partial<WorkTimeDto>) {
    if (init) {
      Object.assign(this, init);
      this.doctor = new DoctorDto(init.doctor);
    }
  }
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '01.01.2020' })
  workDate: string;

  @ApiProperty({ example: '08:00' })
  startTime: string;

  @ApiProperty({ example: '12:00' })
  endTime: string;

  @ApiProperty({ type: DoctorDto })
  doctor: DoctorDto;
}
