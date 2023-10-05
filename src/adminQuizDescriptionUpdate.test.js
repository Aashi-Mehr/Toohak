import { adminQuizDescriptionUpdate } from './quiz.js';
import { adminQuizCreate } from './quiz.js';
import { adminAuthRegister } from './auth.js';
import { clear } from './other.js';

test('AuthUserId is not a valid user', () => {
    clear();
   
    const invalidUser = 10000;
    const quizId = '1';
    const description = 'New description';

    // authUserId is not an integar
    const result =  adminQuizDescriptionUpdate(invalidUser, quizId, description);

    expect(result).toMatchObject({ error: expect.any(String) });
});

test('Quiz ID does not refer to a valid quiz', () => {
    clear();
    // Register user with id: 1
    let authUserId1 = adminAuthRegister("first.last1@gmail.com", "abcd1234", "first", "last").authUserId;
 
    const quizId = '11111';
    const description = 'New description';

    // authUserId is not an integar
    const result =  adminQuizDescriptionUpdate(authUserId1, quizId, description);

    expect(result).toMatchObject({ error: expect.any(String) });
});

test('Quiz ID does not refer to a quiz that this user owns', () => {
    clear();
    // Register user with id: 1
    let authUserId1 = adminAuthRegister("first.last1@gmail.com", "abcd1234", "first", "last").authUserId;
    let authUserId2 = adminAuthRegister("first.last2@gmail.com", "abcd1234", "first2", "last2").authUserId;
 
    let quizId = adminQuizCreate(1, "first last", "fist_test").quizId;

    // authUserId is not an integar
    const result =  adminQuizDescriptionUpdate(authUserId1, quizId, description);

    expect(result).toMatchObject({ error: expect.any(String) });
});

test('Description is more than 100 characters in length (note: empty strings are OK)', () => {
    clear();
 
    let authUserId1 = adminAuthRegister("first.last1@gmail.com", "abcd1234", "first", "last").authUserId;
 
    let quizId = adminQuizCreate(1, "first last", "fist_test").quizId;

    let longDdescription = "";
 
    for (let i = 0; i <= 100; i++) {
        longDdescription += 'a'; // You can replace 'a' with any character you want.
    }
    const result =  adminQuizDescriptionUpdate(authUserId1, quizId, longDdescription);

    expect(result).toMatchObject({ error: expect.any(String) });
});