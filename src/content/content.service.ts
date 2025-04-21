import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Hospital } from '../hospital/hospital.schema';
import { User, UserDocument } from '../user/user.schema';
import { TranslationService } from '../translation/translation.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Hospital.name) private hospitalModel: Model<Hospital>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly translationService: TranslationService,
  ) {}

  async getHospitalContent(hospitalId: string) {
    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(hospitalId);
    } catch (error) {
      throw new NotFoundException('Invalid hospital ID.');
    }

    const hospital = await this.hospitalModel.findById(objectId).lean();
    if (!hospital) {
      throw new NotFoundException('Hospital content not found.');
    }

    // 🔍 Find users with role "Doctor" and hospitalId
    const doctors = await this.userModel
      .find({ role: 'Doctor', hospitalId: objectId })
      .lean();

      const specialists = [...new Set(doctors.map((doc) => (doc as any).specialist))];

    const lang = hospital.defaultLanguage || 'en';

    const welcomeMessage = await this.translationService.getTranslation('welcome_message', lang);
    const hospitalNameKey = await this.translationService.getTranslation('hospitalName', lang);
    const totalDoctorsKey = await this.translationService.getTranslation('totalDoctors', lang);
    const specialistsKey = await this.translationService.getTranslation('specialists', lang);
    const messageKey = await this.translationService.getTranslation('message', lang);
    const establishedDateKey = await this.translationService.getTranslation('establishedDate', lang);

    return {
      [messageKey]: `${welcomeMessage} ${hospital.name}!`,
      [hospitalNameKey]: hospital.name,
      [establishedDateKey]: hospital.createdAt,
      [totalDoctorsKey]: doctors.length,
      [specialistsKey]: specialists,
    };
  }
}
