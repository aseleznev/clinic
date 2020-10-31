import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true, example: 'Иванов Иван Иванович' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true, example: 'Терапевт' })
  speciality: string;
}
