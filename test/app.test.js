const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('/apps', () => {
    it('should return an array of apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
                expect(res.body).to.have.lengthOf.at.least(1)
                const application = res.body[0];
                expect(application).to.include.all.keys(
                    'App', 'Category', 'Rating', 'Genres'
                );
            });
    });

    it('should be 400 if sort is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'MISTAKE' })
            .expect(400, 'Sort must be one of Rating or App');
    });

    it('should return 400 if genre is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'MISTAKE' })
            .expect(400, 'Genre must be one of Action, Puzzle, Strategy, Casual, Arcade, Card')
    });

    it('should sort the list by rating', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'Rating' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;
                
                while(i <res.body.length - 1) {
                    const appAtI= res.body[i];
                    const appAtIPlus1= res.body[i + 1];
                
                if(appAtIPlus1.Rating < appAtI.Rating) {
                    sorted= false;
                    break;
                }
                i++;
                }
                expect(sorted).to.be.true;
            });
    });

    it('should sort the list by App', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'App' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;
                
                while(i <res.body.length - 1) {
                    const appAtI= res.body[i];
                    const appAtIPlus1= res.body[i + 1];
                
                if(appAtIPlus1.App < appAtI.App) {
                    sorted= false;
                    break;
                }
                i++;
                }
                expect(sorted).to.be.true;
            });
    });

    it.only('should return an array of 3 if genres Arcade is selected', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'Arcade'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf(3)
            });
    });    
})
