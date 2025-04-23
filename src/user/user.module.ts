import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { DoctorSchema } from './doctor.schema';
import { PatientSchema } from './patient.schema';
import { UserService } from '../service/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;

          // Register Doctor and Patient as discriminators
          schema.discriminator('Doctor', DoctorSchema);
          schema.discriminator('Patient', PatientSchema);

          return schema;
        },
      },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
