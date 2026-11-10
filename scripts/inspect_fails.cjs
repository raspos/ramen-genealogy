const fs = require('fs');
const path = require('path');

const log = fs.readFileSync('C:\\Users\\kimwo\\.gemini\\antigravity\\brain\\dd0bf1ef-262d-4557-ac43-e949e220d38c\\.system_generated\\tasks\\task-1610.log', 'utf8');

const fails = [...log.matchAll(/(\[SKIP\][^\r\n]+|-> FAIL:[^\r\n]+)/g)].map(m => m[1]);
console.log('Total fails/skips:', fails.length);
fails.forEach(f => console.log(f));
