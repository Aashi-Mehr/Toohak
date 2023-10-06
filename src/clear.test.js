import {adminAuthRegister} from './auth.js';
import {adminQuizInfo} from './quiz.js';
import {adminUserDetails} from './auth.js';
import {adminQuizCreate} from './quiz.js';
import {clear} from './other.js';

test('Clear User', () => {

    // Register user with id: 1
    let authUserId1 = adminAuthRegister("first.last1@gmail.com", "Val1dPassword1", "first1", "last1").authUserId;

    let result = adminUserDetails(authUserId1);
    //console.log(result)
    expect(result).toMatchObject({
        user: {
            userId: authUserId1,
            name: "first1 last1",
            email: "first.last1@gmail.com",
            numSuccessfulLogins: 0,
            numFailedPasswordsSinceLastLogin: 0
        }
    });
    clear();
 
    result = adminUserDetails(authUserId1);
    expect(result).toMatchObject({error: expect.any(String)});
});
test('Clear quizzes', () => {

    // Register user with id: 1
    let authUserId1 = adminAuthRegister("first.last1@gmail.com", "Val1dPassword1", "first1", "last1");
    let result = adminUserDetails(authUserId1);
    expect(result).toMatchObject({
        quizId: 1,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: expect.any(String)
    });

    let quizId1 = adminQuizCreate(authUserId1, "first last", "fist_test").quizId;
     result = adminQuizInfo(authUserId1, quizId1);

    clear();
    result = adminUserDetails(authUserId1);
    expect(result).toMatchObject({error: expect.any(String)});
    result = adminQuizInfo(authUserId1, quizId1);
    expect(result).toMatchObject({error: expect.any(String)});
});

