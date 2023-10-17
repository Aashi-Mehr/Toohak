```javascript
let data = {
    users:
    [
        {
            authUserId: 1,
            nameFirst: 'Hello',
            nameLast: 'World',
            name: 'Hello World',
            email: 'Hello_World@1531.com',
            password: '123456789...',
            successful_log_time: '15',
            failed_password_num: '2',
        },
        // ...
    ],

    quizzes: 
    [
        {
            quizId: 1,
            authId: 1,
            name: 'My Quiz',
            description: 'This is my quiz',
            timeCreated: 202309211910,
            timeLastEdited: 202309211912,
            in_trash: true,
            questions: [
                {
                    question: "Who is the Monarch of England?",
                    duration: 4,
                    points: 5,
                    answer: "answer": "Prince Charles",
                }
            ]
        },
        // ...
    ],

    tokens:
    [
        {
            sessionId: 12345,
            authUserId: 123456,
            is_valid: true,
        }
    ],
}
```

[Optional] short description: 
// Edit: 02/10/2023 by Zhejun Gu
// Add extra element 'name' in users array