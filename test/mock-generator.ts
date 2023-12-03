import { faker } from '@faker-js/faker';
import { SingupDto } from 'app/auth/dto';
import * as bcrypt from 'bcryptjs';

// User Generator
export const userSignupGen = (hash = false): SingupDto => {
  const user = {
    nickname: faker.string.alpha(10),
    password: faker.string.alpha(10),
    email: faker.internet.email(),
  };
  if (hash) {
    user.password = bcrypt.hashSync(user.password, 10);
  }
  return user;
};
