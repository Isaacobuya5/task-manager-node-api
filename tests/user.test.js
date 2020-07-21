const request = require('supertest');

const app = require('../src/app');
const User = require('../src/models/user');
const Test = require('supertest/lib/test');

const userOne = {
    name: 'John',
    email: 'johndoe@gmail.com',
    password: 'qwerty12345'
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
})