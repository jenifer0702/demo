import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Translation, TranslationDocument } from '../translation/translation.schema';

@Injectable()
export class TranslationService implements OnModuleInit {
  constructor(
    @InjectModel(Translation.name)
    private translationModel: Model<TranslationDocument>,
  ) {}

  async onModuleInit() {
    await this.createTranslations(); 
  }


  async createTranslations() {
    const translations = [
      { key: 'name', en: 'Name', ar: 'الاسم' },
      { key: 'address', en: 'Address', ar: 'العنوان' },
      { key: 'email', en: 'Email', ar: 'البريد الإلكتروني' },
      { key: 'hospital_name', en: 'Hospital Name', ar: 'اسم المستشفى' },
      { key: 'doctor_list', en: 'List of Doctors', ar: 'قائمة الأطباء' },
      { key: 'patient_list', en: 'List of Patients', ar: 'قائمة المرضى' },
      { key: 'specialist', en: 'Specialist', ar: 'أخصائي' },
      { key: 'diagnosis', en: 'Diagnosis', ar: 'التشخيص' },
      
    ];

    for (const translation of translations) {
      await this.translationModel.updateOne(
        { key: translation.key },
        { $set: translation },
        { upsert: true },
      );
    }
  }

  async getTranslation(key: string, lang: string): Promise<string> {
    const translation = await this.translationModel.findOne({ key }).lean();
    if (!translation || !translation[lang]) {
      throw new NotFoundException(`Translation not found for key: ${key}`);
    }
    return translation[lang];
  }

  
  async get(key: string, lang: string): Promise<string> {
    return this.getTranslation(key, lang);
  }

  
  async translateList(data: any[], lang: string): Promise<any[]> {
    const translations = await this.getTranslations(lang);

    return data.map(item => {
      const translatedItem: any = {};
      for (const [key, value] of Object.entries(item)) {
        const translatedKey = translations[key] || key;
        translatedItem[translatedKey] = value;
      }
      return translatedItem;
    });
  }

  
  async getTranslations(lang: string): Promise<Record<string, string>> {
    const records = await this.translationModel.find().lean();
    const result: Record<string, string> = {};
    for (const t of records) {
      result[t.key] = t[lang] || t.en;
    }
    return result;
  }

  
  async upsertTranslation(key: string, en: string, ar: string): Promise<Translation> {
    return this.translationModel.findOneAndUpdate(
      { key },
      { en, ar },
      { new: true, upsert: true },
    );
  }

  async getAll(): Promise<Translation[]> {
    return this.translationModel.find().lean();
  }
}
