'use strict';

const supertest = require('supertest');
const app = require('../../app');

describe('Pages Controller', () => {
    it('Should respond with 404 on no existing page', done => {
        supertest(app)
            .get('/nonExistentPage')
            .expect(404, done)
    });
});
