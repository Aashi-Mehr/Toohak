// Project-backend iteration 0
//
// other.js
//
// authors:
// Zhejun Gu (z5351573)
// Alya Nur Najwa (z5445823)
//
// edit: 
// 29/09/2023
//
// Iteration 1: Function Implementation
// edit: 06/10/2023
//
// clear (parameters: void(); return: empty{})
// Reset state of the application back to the start
import { getData, setData } from './dataStore.js';

function clear() {
    let emptyData = {
        users: [],
        quizzes: [],
    };

    setData(emptyData);
}

export { clear };