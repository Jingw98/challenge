import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('ScheduleController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
     await prisma.schedule.deleteMany({
      where: { account_id: 999999 },
    });
    await app.close();
  });

  beforeEach(async () => {
    await prisma.schedule.deleteMany({
      where: { account_id: 999999 },
    });
  });
  const start_time = new Date().toISOString()
  const end_time = new Date().toISOString()


  const mockSchedule1 = {
    account_id: 999999,
    agent_id: 123,
    start_time,
    end_time
  }

  const mockSchedule2 = {
    account_id: 999999,
    agent_id: 123,
    start_time,
    end_time
  }
  describe('/schedules (GET)', () => {
    it('should return all schedules', async () => {
      await prisma.schedule.createMany({
        data: [mockSchedule1, mockSchedule2],
      });

      const response = await request(app.getHttpServer())
        .get('/schedules?limit=10')
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining(mockSchedule1),
          expect.objectContaining(mockSchedule2),
        ]),
      );
    });
  });

  describe('/schedules/:id (GET)', () => {
    it('should return a schedule by ID', async () => {
      const schedule = await prisma.schedule.create({
        data: mockSchedule1,
      });

      const response = await request(app.getHttpServer())
        .get(`/schedules/${schedule.id}`)
        .expect(200);

      expect(response.body).toMatchObject(
        mockSchedule1
      );
    });

    it('should return 404 if the schedule does not exist', async () => {
      await request(app.getHttpServer())
        .get('/schedules/1')
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'Schedule with ID 1 not found',
          error: 'Not Found',
        });
    });
  });

  describe('/schedules (POST)', () => {
    it('should create a new schedule', async () => {
      const response = await request(app.getHttpServer())
        .post('/schedules')
        .send(mockSchedule1)
        .expect(201);

      expect(response.body).toMatchObject(mockSchedule1);

      const scheduleInDb = await prisma.schedule.findUnique({
        where: { id: response.body.id },
      });
      expect(scheduleInDb).toBeDefined();
    });
  });

  describe('/schedules/:id (PUT)', () => {
    it('should update an existing schedule', async () => {
      const schedule = await prisma.schedule.create({ data: mockSchedule1 });

      const updatedData = { account_id: 999 };
      const response = await request(app.getHttpServer())
        .put(`/schedules/${schedule.id}`)
        .send(updatedData)
        .expect(200);

      expect(response.body).toMatchObject({
        ...mockSchedule1,
        account_id: updatedData.account_id,
      });

      const scheduleInDb = await prisma.schedule.findUnique({
        where: { id: schedule.id },
      });
      expect(scheduleInDb.account_id).toBe(updatedData.account_id);
    });

    it('should return 404 if the schedule does not exist', async () => {
      await request(app.getHttpServer())
        .put('/schedules/1')
        .send({ account_id: 999 })
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'Schedule with ID 1 not found',
          error: 'Not Found',
        });
    });
  });

  describe('/schedules/:id (DELETE)', () => {
    it('should delete an existing schedule', async () => {
      const schedule = await prisma.schedule.create({ data: mockSchedule1 });

      await request(app.getHttpServer())
        .delete(`/schedules/${schedule.id}`)
        .expect(200);

      const scheduleInDb = await prisma.schedule.findUnique({
        where: { id: schedule.id },
      });
      expect(scheduleInDb).toBeNull();
    });

    it('should return 404 if the schedule does not exist', async () => {
      await request(app.getHttpServer())
        .delete('/schedules/1')
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'Schedule with ID 1 not found',
          error: 'Not Found',
        });
    });
  });
});
