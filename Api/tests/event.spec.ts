import {describe, it} from '@jest/globals'
import mongoose from 'mongoose';
import Event from '../src/models/event.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
let should = chai.should();

chai.use(chaiHttp);

const pathToEvents = ('/events');
const numberOfEvents = 4;
 

describe('GET ALL events', () => {
    it('TEST # 1 - it should GET all the events', (done) => {
      chai.request('http://192.168.1.104:3000')
          .get(pathToEvents)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(numberOfEvents);
            done();
          });
    });
});

