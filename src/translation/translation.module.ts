import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Translation, TranslationSchema } from './translation.schema';
import { TranslationController } from './translation.controller';
import { TranslationService } from '../service/translation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Translation.name, schema: TranslationSchema },
    ]),
  ],
  controllers: [TranslationController],  
  providers: [TranslationService],       
  exports: [TranslationService],         
})
export class TranslationModule {}
