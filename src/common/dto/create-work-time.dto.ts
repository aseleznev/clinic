import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class CreateWorkTimeDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{2}.\d{2}.\d{4}$/, { message: "workDate must match 'DD.MM.YYYY' pattern" })
  @ApiProperty({ example: '01.01.2020' })
  workDate: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: "startTime must match 'HH:MM' pattern" })
  @ApiProperty({ example: '08:00' })
  startTime: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: "startTime must match 'HH:MM' pattern" })
  @ApiProperty({ example: '12:00' })
  endTime: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  doctorId: number;
}
