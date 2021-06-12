import {describe, it} from '@jest/globals'
import mongoose from 'mongoose';
import LocationRegistration from '../src/models/locationRegistration';
import chai from 'chai';
import chaiHttp from 'chai-http';
let should = chai.should();

chai.use(chaiHttp);

const pathToReplayLocations = ('/locationRegistrations/getreplay/');
const eventId = 2;
const numberOfLocations = 4;
 
describe('GET ALL locationRegistrations on event ' + eventId, () => {
    it('TEST # 1 - it should GET all the locationRegistrations on event ' + eventId, (done) => {
      chai.request('http://192.168.1.104:3000')
          .get(pathToReplayLocations + eventId)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(numberOfLocations);
            done();
          });
    });
});



