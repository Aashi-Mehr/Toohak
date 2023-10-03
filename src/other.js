// Project-backend iteration 0
//
// other.js
//
// authors:
// Zhejun Gu (z5351573)
//
// edit: 
// 29/09/2023
//

// clear (parameters: void(); return: empty{})
// Reset state of the application back to the start
import { getData, setData } from './dataStore.js';

function clear() {
    setData({
        users: [],
    });
}
 
export { clear };