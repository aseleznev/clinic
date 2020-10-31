import { ApiProperty } from '@nestjs/swagger';
import { WorkTimeDto } from './work-time.dto';

export class DoctorDto {
  constructor(init?: Partial<DoctorDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Иванов Иван Иванович' })
  name: string;

  @ApiProperty({ example: 'Терапевт' })
  speciality: string;

  @ApiProperty({ type: WorkTimeDto })
  workTime: WorkTimeDto[];
}
