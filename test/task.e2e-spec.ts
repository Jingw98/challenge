import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { scheduled } from 'rxjs';
import { TaskType } from '@prisma/client';

describe('TaskController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let mockSchedule;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        prisma = app.get(PrismaService);
        await app.init();
        await prisma.task.deleteMany();
        await prisma.schedule.deleteMany();

        mockSchedule = await prisma.schedule.create({
            data: {
                account_id: 888888,
                agent_id: 123456,
                start_time: new Date().toISOString(),
                end_time: new Date().toISOString(),
            },
        });
    });

    afterAll(async () => {
        await prisma.task.deleteMany({ where: { account_id: 888888 } });
        await prisma.schedule.deleteMany({ where: { account_id: 888888 } });

        await app.close();
    });

    beforeEach(async () => {
        await prisma.task.deleteMany({ where: { account_id: 888888 } });
    });


    const mockTask1 = {
        account_id: 888888,
        start_time: new Date().toISOString(),
        duration: 1000,
        type: TaskType.work
    };

    const mockTask2 = {
        account_id: 888888,
        start_time: new Date().toISOString(),
        duration: 3000,
        type: TaskType.break
    };

    describe('/tasks (GET)', () => {
        it('should return all tasks', async () => {
            const input = [{
                schedule_id: mockSchedule.id,
                ...mockTask1
            }, {
                schedule_id: mockSchedule.id,
                ...mockTask2
            }]

            await prisma.task.createMany({
                data: input,
            });

            const response = await request(app.getHttpServer())
                .get('/tasks')
                .expect(200);

            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining(input[0]),
                    expect.objectContaining(input[1]),
                ]),
            );
        });
    });

    describe('/tasks/:id (GET)', () => {
        it('should return a task by ID', async () => {
            const input = { schedule_id: mockSchedule.id, ...mockTask1 }
            const task = await prisma.task.create({
                data: { schedule_id: mockSchedule.id, ...mockTask1 },
            });

            const response = await request(app.getHttpServer())
                .get(`/tasks/${task.id}`)
                .expect(200);

            expect(response.body).toMatchObject(input);
        });

        it('should return 404 if task does not exist', async () => {
            await request(app.getHttpServer())
                .get('/tasks/1')
                .expect(404)
                .expect({
                    statusCode: 404,
                    message: 'Task with ID 1 not found',
                    error: 'Not Found',
                });
        });
    });

    describe('/tasks (POST)', () => {
        it('should create a new task', async () => {
            const input = { schedule_id: mockSchedule.id, ...mockTask1 };

            const response = await request(app.getHttpServer())
                .post('/tasks')
                .send(input)
                .expect(201);

            expect(response.body).toMatchObject(input);

            const taskInDb = await prisma.task.findUnique({
                where: { id: response.body.id },
            });

            expect(taskInDb).toBeDefined()
        });
    });

    describe('/tasks/:id (DELETE)', () => {
        it('should delete an existing task', async () => {
            const input = { schedule_id: mockSchedule.id, ...mockTask1 }

            const task = await prisma.task.create({
                data: input
            });

            await request(app.getHttpServer())
                .delete(`/tasks/${task.id}`)
                .expect(200);

            const taskInDb = await prisma.task.findUnique({
                where: { id: task.id },
            });

            expect(taskInDb).toBeNull();
        });

        it('should return 404 if task does not exist', async () => {
            await request(app.getHttpServer())
                .delete('/tasks/1')
                .expect(404)
                .expect({
                    statusCode: 404,
                    message: 'Task with ID 1 not found',
                    error: 'Not Found',
                });
        });
    });
});
