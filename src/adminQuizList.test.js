// adminQuizList test function
// 
// authors:
// Zhejun Gu (z5351573)
//
// edit:
// 05/10/2023
//

import { adminQuizList } from './quiz.js';
import { adminQuizCreate } from './quiz.js';
import { adminAuthRegister } from './auth.js';
import { adminQuizInfo } from './quiz.js';
import { clear } from './other.js';

test('Test Invalid User Ids', () => {
    clear();
    // Register user with id: 1
    adminAuthRegister("first.last1@gmail.com", "abcd1234", "first", "last");

    // authUserId is not an integar
    let result = adminQuizList("12321");
    expect(result).toMatchObject({ error: expect.any(String) });

    // authUserId is out of valid range
    result = adminQuizList(-1);
    expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test valid format User Id but not exist in data base', () => {
    clear();
    // Register user with id: 1
    adminAuthRegister("first.last2@gmail.com", "efgh5678", "first2", "last2");

    // Correct format UserId but never is the Id being registered
    let result = adminQuizInfo(4, 1);
    expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Valid User Ids', () => {
    clear();
    
    let authId = adminAuthRegister('1531_user1@gmail.com', 'C123321c', 'first', 'last').authUserId;
    let qzId = adminQuizCreate(authId, 'first last', '').quizId;

    let result = adminQuizList(authId);
    expect(result).toMatchObject({
        quizzes: [
            {
                quizId: qzId,
                name: 'first last', 
            }
        ]
    });
});
