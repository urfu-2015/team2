const mongoose = require('../../scripts/mongooseConnect');
const User = require('../../models/user');
const Quests = require('../../models/quests');
const QuestsStatus = require('../../models/questsStatus');
const clearDB = require('../../scripts/clearDB');
require('chai').should();

describe('Example spec for a model', function () {
    this.timeout(20000);
    before(function (done) {
        clearDB(done);
    });

    after(function (done) {
        clearDB(done);
    });

    it('should create a new User', function (done) {
        const u = {
            login: 'Channing Tatum',
            avatar: 'awwwww'
        };
        User.create(u, (err, createdUser) => {
            createdUser.login.should.equal('Channing Tatum');
            createdUser.avatar.should.equal('awwwww');
            done();
        });
    });

    it('should return user', done => {
        User.findUserForTest({ login: 'Channing Tatum' }, foundUser => {
            foundUser = foundUser.pop();
            foundUser.login.should.equal('Channing Tatum');
            foundUser.avatar.should.equal('awwwww');
            done();
        });
    });

    it('should create a new Quest', function (done) {
        const quest = {
            name: 'Night city',
            city: 'St.Petersburg',
            description: 'Awesome',
            likesCount: 0,
            dislikesCount: 0
        };
        Quests.create(quest, (err, createdQuest) => {
            createdQuest.name.should.equal('Night city');
            createdQuest.city.should.equal('St.Petersburg');
            createdQuest.description.should.equal('Awesome');
            createdQuest.likesCount.should.equal(0);
            createdQuest.dislikesCount.should.equal(0);
            done();
        });
    });

    it('should return quest', done => {
        Quests.findQuests({ name: 'Night city' }, foundQuest => {
            foundQuest = foundQuest.pop();
            foundQuest.name.should.equal('Night city');
            foundQuest.city.should.equal('St.Petersburg');
            foundQuest.description.should.equal('Awesome');
            foundQuest.likesCount.should.equal(0);
            foundQuest.dislikesCount.should.equal(0);
            done();
        });
    });

    it('should create questStatus', done => {
        User.findUserForTest({ login: 'Channing Tatum' }, foundUser => {
            foundUser = foundUser.pop();
            Quests.findQuests({ name: 'Night city' }, foundQuest => {
                foundQuest = foundQuest.pop();

                const questStatus = {
                    questId: foundQuest._id,
                    userId: foundUser._id,
                    status: 'started'
                };
                QuestsStatus.create(questStatus, (err, createdQuestStatus) => {
                    createdQuestStatus.questId.should.equal(foundQuest._id);
                    createdQuestStatus.userId.should.equal(foundUser._id);
                    createdQuestStatus.status.should.equal('started');
                    done();
                });
            });
        });
    });

    it('should return user quests', done => {
        User.findUserForTest({ login: 'Channing Tatum' }, foundUser => {
            foundUser = foundUser.pop();
            foundUser.getUserQuests(foundQuests => {
                foundQuests = foundQuests.pop();
                /*foundQuests.userId.should.equal(foundUser._id);*/
                foundQuests.status.should.equal('started');
                done();
            });
        });
    });
});
