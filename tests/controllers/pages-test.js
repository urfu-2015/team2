'use strict';

const supertest = require('supertest');
const appPromise = require('../../app');

describe('Pages Controller', () => {
    it('Should respond with 404 on no existing page', done => {
        appPromise.then(app => {
            supertest(app)
                .get('/nonExistentPage')
                .expect(404, done);
        });
    });
    it('Should respond with 200 on GET "/"', done => {
        appPromise.then(app => {
            supertest(app)
                .get('/')
                .expect(200, done);
        });
    });
});
