import { faker } from '@faker-js/faker';
import { SingupDto } from 'app/auth/dto';

// User Generator
export const userSignupGen = (): SingupDto => {
  return {
    nickname: faker.string.alpha(10),
    password: faker.string.alpha(10),
    email: faker.internet.email(),
  };
};
