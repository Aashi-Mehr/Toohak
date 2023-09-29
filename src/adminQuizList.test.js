// adminQuizList test function
// 
// authors:
// Zhejun Gu (z5351573)
//
// edit:
// 29/09/2023
//

import { adminQuizList } from './quiz.js';
import { adminQuizCreate } from './quiz.js';
import { adminAuthRegister } from './auth.js';
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

test('Test valid format User Id but not exist in data base', () =>{
    clear();
    // Register user with id: 1
    adminAuthRegister("first.last2@gmail.com", "efgh5678", "first2", "last2");

    // Correct format UserId but never is the Id being registered
    let result = adminQuizInfo(4, 1);
    expect(data.has(result)).toBe(false);
});

test('Test Valid User Ids', () => {
    clear();
    let result = adminQuizList(1);
    expect(result).toMatchObject({
        quizzes: [
            {
                quizId: expect.any(Number),
                name: expect.any(String), 
            }
        ]
    });
});
