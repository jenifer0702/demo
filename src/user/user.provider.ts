// user.providers.ts
import { Connection } from 'mongoose';
import { UserSchema } from './user.schema';
import { DoctorSchema } from './doctor.schema';

export const userProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) => {
      const baseUser = connection.model('User', UserSchema);
      baseUser.discriminator('doctor', DoctorSchema);
      return baseUser;
    },
    inject: ['mongodb://localhost:27017/nest-crud'],
  },
];
