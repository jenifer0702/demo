import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Doctor, DoctorSchema } from './doctor.schema';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AuthModule } from '../auth/auth.module'; // ✅ Import AuthModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
    AuthModule, // ✅ Add AuthModule to access AuthService
    JwtModule.register({ secret: 'hardcoded_secret_key', signOptions: { expiresIn: '1h' } }), 
  ],
  controllers: [DoctorController],
  providers: [DoctorService, JwtAuthGuard],
  exports: [DoctorService],
})
export class DoctorModule {}
