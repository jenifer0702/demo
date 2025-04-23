import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TranslationService } from '../service/translation.service';

@Controller('translations')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  
  @Get()
  async getAllTranslations(@Query('lang') lang: string = 'en') {
    return this.translationService.getTranslations(lang);
  }

  
  @Post()
  async createOrUpdateTranslation(@Body() body: { key: string; en: string; ar: string }) {
    const { key, en, ar } = body;
    return this.translationService.upsertTranslation(key, en, ar);
  }
}
