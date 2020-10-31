import { ApiProperty } from '@nestjs/swagger';

export class StatusDto {
  constructor(init?: Partial<StatusDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'ok' })
  message: string;
}
