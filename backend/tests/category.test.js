const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../app');

require('dotenv').config();

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe('GET /api/v1/category', () => {
  it('should return all category', async () => {
    const res = await request(app).get('/api/v1/category');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.status).toBe('success');
  });

  it('check category data with all the mentioned keys', async () => {
    const res = await request(app).get('/api/v1/category');
    expect(res.statusCode).toBe(200);
    expect(res.body.data[0].id).toBeDefined();
    expect(res.body.data[0].name).toBeDefined();
    expect(res.body.data[0].children).toBeDefined();
  });
});

describe('POST and DELETE request testing', () => {
  it('should return error if name not present', async () => {
    const res = await request(app).post('/api/v1/category').send({
      name: '',
    });
    expect(res.statusCode).toBe(400);
  });

  it('adding category and deleting it', async () => {
    //testing category add at root level
    const resAdd = await request(app).post('/api/v1/category').send({
      name: 'Test 1',
    });
    expect(resAdd.statusCode).toBe(201);
    expect(resAdd.body.data.name).toBe('Test 1');

    //testing category add with parentId
    const resAdd2 = await request(app).post('/api/v1/category').send({
      name: 'Test 2',
      parentId: resAdd.body.data.id,
    });
    expect(resAdd2.statusCode).toBe(201);
    expect(resAdd2.body.data.name).toBe('Test 2');
    expect(resAdd2.body.data.parent).toBeDefined();

    //deleting the root level category
    const resDelete = await request(app).delete(
      `/api/v1/category/${resAdd.body.data.id}`
    );
    expect(resDelete.statusCode).toBe(200);
  });
});

describe('UPDATE request testing', () => {
  it('should return error if name not present', async () => {
    const categoryRes = await request(app).get('/api/v1/category');
    const category = categoryRes.body.data[0];

    const res = await request(app)
      .patch(`/api/v1/category/${category.id}`)
      .send({
        name: '',
      });
    expect(res.statusCode).toBe(400);
  });

  it('fetching the categories updating it and then restoring it', async () => {
    //fetching the category
    const categoryRes = await request(app).get('/api/v1/category');
    const category = categoryRes.body.data[0];

    // updating the category
    const res = await request(app)
      .patch(`/api/v1/category/${category.id}`)
      .send({
        name: 'Test',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('Test');

    //restoring the category
    const restore = await request(app)
      .patch(`/api/v1/category/${category.id}`)
      .send({
        name: category.name,
      });
    expect(restore.statusCode).toBe(200);
    expect(restore.body.data.name).toBe(category.name);
  });
});
