import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientDto } from '../common/dto/patient.dto';
import { StatusDto } from '../common/dto/status.dto';
import { PatientEntity } from './patient.entity';
import { CreatePatientDto } from '../common/dto/create-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>
  ) {}

  async findAll(): Promise<PatientDto[]> {
    return await this.patientRepository.find({ relations: ['appointment'] });
  }

  async findOne(id: number): Promise<PatientDto> {
    return await this.patientRepository.findOne(id, { relations: ['appointment'] });
  }

  async insert(patient: CreatePatientDto): Promise<StatusDto> {
    const result = await this.patientRepository.insert(patient);
    if (result.identifiers.length) {
      return new StatusDto({ success: true, message: `id:${result.identifiers[0].id}, row saved` });
    } else {
      return new StatusDto({ success: false, message: result.raw });
    }
  }

  async update(id: number, patient: CreatePatientDto): Promise<StatusDto> {
    const result = await this.patientRepository.update({ id }, patient);
    if (result.affected > 0) {
      return new StatusDto({ success: true, message: `id:${id}, row updated` });
    } else {
      return new StatusDto({ success: false, message: `id:${id}, row does not exist` });
    }
  }

  async delete(id: number): Promise<StatusDto> {
    const result = await this.patientRepository.delete(id);
    if (result.affected > 0) {
      return new StatusDto({ success: true, message: `id:${id}, row deleted` });
    } else {
      return new StatusDto({ success: false, message: `id:${id}, row does not exist` });
    }
  }

  hasRequiredProperties(patient: CreatePatientDto) {
    return (
      patient.hasOwnProperty('name') && patient.hasOwnProperty('age') && patient.hasOwnProperty('tel') && patient.hasOwnProperty('gender')
    );
  }

  hasProperties(patient: CreatePatientDto) {
    return (
      patient.hasOwnProperty('name') || patient.hasOwnProperty('age') || patient.hasOwnProperty('tel') || patient.hasOwnProperty('gender')
    );
  }
}
