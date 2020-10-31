import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorEntity } from './doctor.entity';
import { Repository } from 'typeorm';
import { StatusDto } from '../common/dto/status.dto';
import { DoctorDto } from '../common/dto/doctor.dto';
import { CreateDoctorDto } from '../common/dto/create-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(DoctorEntity)
    private doctorRepository: Repository<DoctorEntity>
  ) {}

  async findAll(): Promise<DoctorDto[]> {
    return await this.doctorRepository.find({ relations: ['workTime', 'appointment'] });
  }

  async findOne(id: number): Promise<DoctorDto> {
    return await this.doctorRepository.findOne(id, { relations: ['workTime', 'appointment'] });
  }

  async insert(doctor: CreateDoctorDto): Promise<StatusDto> {
    const result = await this.doctorRepository.insert(doctor);
    if (result.identifiers.length) {
      return new StatusDto({ success: true, message: `id:${result.identifiers[0].id}, row saved` });
    } else {
      return new StatusDto({ success: false, message: result.raw });
    }
  }

  async update(id: number, doctor: CreateDoctorDto): Promise<StatusDto> {
    const result = await this.doctorRepository.update({ id }, doctor);
    if (result.affected > 0) {
      return new StatusDto({ success: true, message: `id:${id}, row updated` });
    } else {
      return new StatusDto({ success: false, message: `id:${id}, row does not exist` });
    }
  }

  async delete(id: number): Promise<StatusDto> {
    const result = await this.doctorRepository.delete(id);
    if (result.affected > 0) {
      return new StatusDto({ success: true, message: `id:${id}, row deleted` });
    } else {
      return new StatusDto({ success: false, message: `id:${id}, row does not exist` });
    }
  }
}
