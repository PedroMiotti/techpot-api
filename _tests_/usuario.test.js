// IMPORTS 
// App
const app = require('./app.js');
// Supertest
const request = require('supertest');


describe('Positive Tests --> User Routes', () => {
  it('Should return user information', async () => {
    const userID = 2;
    const res = await request(app)
      .get(`/api/v1/usuarios/${userID}`)
    expect(res.status).toBe(200);
    // expect(res.body).objectContainig({ u });
  });
});
