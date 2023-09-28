// adminQuizInfo test function
// 
// authors:
// Zhejun Gu (z5351573)
//
// edit:
// 28/09/2023
//

import { adminQuizInfo } from './quiz.js';
import { clear } from './other.js';

test('Test Invalid User Ids', () => {
    clear();
    // authUserId is not an integar
    let result = adminQuizInfo("12321", 1);
    expect(result).toMatchObject({ error: expect.any(String) });

    // authUserId is out of valid range
    result = adminQuizInfo(-1, 1);
    expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Invalid Quiz Ids', () => {
    clear();
    // Quiz ID does not refer to a valid quiz
    let result = adminQuizInfo(1, -100);
    expect(result).toMatchObject({ error: expect.any(String) });

    // Quiz ID does not refer to a quiz that this user owns
    // e.g. quizId 4 belongs to user2 not user1
    user1 = adminQuizInfo(1, 4);
    expect(user1).toMatchObject({ error: expect.any(String) });
});

test('Test Valid User and Quiz Ids', () => {
    clear();

    let a = any(Number);
    let result = adminQuizInfo(1, a);

    expect(result).toMatchObject({
        quizId: a,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: expect.any(String),
    });
});