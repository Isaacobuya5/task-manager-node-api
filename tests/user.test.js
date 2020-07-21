const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = require('../src/app');
const User = require('../src/models/user');
const Test = require('supertest/lib/test');


const userOneId = new mongoose.Types.ObjectId;
const userOne = {
    _id: userOneId,
    name: 'John',
    email: 'johndoe@gmail.com',
    password: 'qwerty12345',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}


beforeEach(async() => {
   await User.deleteMany();
   await new User(userOne).save()
});


test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'tom',
        email: 'tomonyango@gmail.com',
        password: 'qwerty1234'
    }).expect(201)
});

test('Should login an existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
});

test('Should not login non-existent user', async () => {
    await request(app).post('/users/login').send({
        email: 'thomaswino@gmail.com',
        password: 'thomas54343'
    }).expect(400)
})

// testing autnentication
test('Should get profile for user', async () => {
    await request(app).get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
});

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
    .get('/users/me')
    .expect(401);
})