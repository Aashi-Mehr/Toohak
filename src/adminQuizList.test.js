// adminQuizList test function
// 
// authors:
// Zhejun Gu (z5351573)
//
// edit:
// 29/09/2023
//

import { adminQuizList } from './quiz.js';
import { clear } from './other.js';

test('Test Invalid User Ids', () => {
    clear();
    // authUserId is not an integar
    let result = adminQuizList("12321");
    expect(result).toMatchObject({ error: expect.any(String) });

    // authUserId is out of valid range
    result = adminQuizList(0);
    expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test valid format User Id but not exist in data base', () =>{
    clear();
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
