// adminQuizInfo test function
// 
// authors:
// Zhejun Gu (z5351573)
//
// edit:
// 05/10/2023
//

import { adminQuizInfo } from './quiz.js';
import { adminQuizCreate } from './quiz.js';
import { adminAuthRegister } from './auth.js';
import { clear } from './other.js';

test('Test Invalid User Ids', () => {
    clear();
    // Register user with id: 1
    adminAuthRegister("first.last1@gmail.com", "abcd1234", "first", "last");

    // authUserId is not an integar
    let result = adminQuizInfo("12321", 1);
    expect(result).toMatchObject({ error: expect.any(String) });

    // authUserId is out of valid range
    result = adminQuizInfo(-1, 1);
    expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Invalid Quiz Ids', () => {
    clear();
    // Register test id: 2 by user id: 1 
    adminQuizCreate(1, "first last", "fist_test");

    // Quiz ID does not refer to a valid quiz
    let result = adminQuizInfo(1, -100);
    expect(result).toMatchObject({ error: expect.any(String) });

    // Quiz ID does not refer to a quiz that this user owns
    result = adminQuizInfo(2, 2);
    expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test valid format User Id but not exist in data base', () =>{
    clear();
    // Register user with id: 1
    adminAuthRegister("first.last2@gmail.com", "efgh5678", "first2", "last2");

    // Correct format UserId but never is the Id being registered
    let result = adminQuizInfo(4, 1);
    expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Valid User and Quiz Ids', () => {
    clear();

    let authId = adminAuthRegister('1531_user1@1531.com', 'C123321c', 'first', 'last').authUserId;
    let qzId = adminQuizCreate(authId, 'first last', '').quizId;

    expect(adminQuizInfo(authId, qzId)).toMatchObject({
        quizId: qzId,
        name: 'first last',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: expect.any(String),
    });
});