import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { StatusDto } from '../common/dto/status.dto';
import { AppointmentService } from './appointment.service';
import { AppointmentDto } from '../common/dto/appointment.dto';
import { CreateAppointmentDto } from '../common/dto/create-appointment.dto';

@ApiTags('appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  async findAll(): Promise<AppointmentDto[]> {
    return await this.appointmentService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id', new ParseIntPipe()) id: number, @Res() res): Promise<AppointmentDto> {
    const result = await this.appointmentService.findOne(id);
    if (result) {
      return res.status(HttpStatus.OK).send(result);
    } else {
      return res.status(HttpStatus.NOT_FOUND).send(new StatusDto({ success: false, message: `id:${id}, row not found` }));
    }
  }

  @Post()
  @ApiBody({ type: CreateAppointmentDto })
  async save(@Body() appointment: CreateAppointmentDto, @Res() res): Promise<StatusDto> {
    if (this.appointmentService.hasRequiredProperties(appointment)) {
      const result = await this.appointmentService.insert(appointment);
      return this.sendResult(result, res);
    } else {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(new StatusDto({ success: false, message: `the entity does not have required properties` }));
    }
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number, @Res() res): Promise<StatusDto> {
    const result = await this.appointmentService.delete(id);
    return this.sendResult(result, res);
  }

  sendResult(result: StatusDto, res): Promise<StatusDto> {
    if (!result.success) {
      return res.status(HttpStatus.BAD_REQUEST).send(result);
    }
    return res.status(HttpStatus.OK).send(result);
  }
}
