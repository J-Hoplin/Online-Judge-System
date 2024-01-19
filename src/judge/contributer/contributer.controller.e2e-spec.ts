import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InitializeAdmin } from 'app/admin-init';
import { AppModule } from 'app/app.module';
import { PrismaService } from 'app/prisma/prisma.service';

describe('/judge/contributer', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testModule.createNestApplication();
    prisma = testModule.get<PrismaService>(PrismaService);

    await InitializeAdmin(app);
    await app.init();
  });

  afterAll(async () => {
    await prisma.deleteAll();
    await app.close();
  });
});
