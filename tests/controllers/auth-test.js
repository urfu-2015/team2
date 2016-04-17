'use strict';

const supertest = require('supertest');
const nock = require('nock');

require('chai').should();

const appPromise = require('../../app');

describe.skip('Auth Controller', () => {
    it('Should redirect to /quests', done => {
        nock('https://yahackathonteam2.auth0.com/')
            .get('/authorize')
            .reply(200, undefined, { location: 'https://yahackathonteam2.com/login' });

        appPromise.then(app => {
            supertest(app)
                .get('/login')
                .expect(302, (err, res) => {
                    console.log(res);
                    res.header.location.should.include('/quests');
                    done();
                });
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
