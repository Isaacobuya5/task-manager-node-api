const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {userOneId,userTwoId, userOne, setupDatabase, taskOne, userTwo} = require("./fixtures/db");

beforeEach(setupDatabase);

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'test create task'
        })
        .expect(201)
        const task = await Task.findById(response.body._id)
        expect(task).not.toBeNull();
        expect(task.completed).toBe(false);
})

test('Should fetch all tasks for user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        expect(response.body.length).toBe(2);
})

test('Should not succesfuly delete task for another user', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
        const task = await Task.findById(taskOne._id);
        expect(task).not.toBeNull();
});

test('Should not create task with invalid completed status', async () => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'example task',
            completed: 12233
        }).expect(400)
})

test('Should delete a user task succesfully', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        const task = await Task.findById(taskOne._id);
        expect(task).toBeNull()
})

test('Should not delete a task if unauthenticated', async () => {
    await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .send()
    .expect(401)
})

test('Should not update task with invalid description', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: 56565
        }).expect(400)

})