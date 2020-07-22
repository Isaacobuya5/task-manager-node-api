const request = require('supertest');

const app = require('../src/app');
const User = require('../src/models/user');
const Test = require('supertest/lib/test');

const {userOneId, userOne, setupDatabase} = require("./fixtures/db");



beforeEach(setupDatabase);


test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'tom',
        email: 'tomonyango@gmail.com',
        password: 'qwerty1234'
    }).expect(201)

    // Assert test that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about response
    expect(response.body).toMatchObject({
        user: {
            name: 'tom',
            email: 'tomonyango@gmail.com'
        },
        token: user.tokens[0].token
    });

    // assert about password
    expect(user.password).not.toBe('qwerty1234')
});

test('Should login an existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

   // Validate that user token is saved
   const user = await User.findById(userOneId);
   expect(response.body.token).toBe(user.tokens[1].token);

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
});

test('Should delete account for user', async () => {
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    // Assert that the user was actually removed
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
});

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
        // assert binary data was saved
        const user = await User.findById(userOneId);
        expect(user.avatar).toEqual(expect.any(Buffer));

})

test('Should update valid user fileds', async () => {
  await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'James'
        }).expect(200)

        const user = await User.findById(userOneId);
        expect(user.name).toBe('James');

})

test('Should not update invalid user fields', async () => {
 await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        subject: 'James'
    }).expect(400)
})

/** 
 * More things that we can test
 *
*/
