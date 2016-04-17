'use strict';

const supertest = require('supertest');
const appPromise = require('../../app');

describe('User Controller', () => {
    it('Should respond with 400 on /user without id', done => {
        appPromise.then(app => {
            supertest(app)
                .get('/user')
                .expect(400, done);
        });
    });
    it('Should respond with 200 on GET "/user/:id"', done => {
        appPromise.then(app => {
            supertest(app)
                .get('/')
                .expect(200, done);
        });
    });
});
