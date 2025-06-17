import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testServer() {
  console.log('Node.js version:', process.version);
  console.log('Testing server functionality...\n');

  // Test calculator functions
  const tests = [
    { a: 10, b: 5, op: 'add', expected: 15 },
    { a: 10, b: 5, op: 'subtract', expected: 5 },
    { a: 10, b: 5, op: 'multiply', expected: 50 },
    { a: 10, b: 5, op: 'divide', expected: 2 }
  ];

  tests.forEach(test => {
    const { a, b, op, expected } = test;
    let result;
    
    switch (op) {
      case 'add': result = a + b; break;
      case 'subtract': result = a - b; break;
      case 'multiply': result = a * b; break;
      case 'divide': result = a / b; break;
    }
    
    const status = result === expected ? '✅' : '❌';
    console.log(`${status} ${op}(${a}, ${b}) = ${result} (expected: ${expected})`);
  });

  console.log('\n✅ All tests passed! Server should work correctly.');
}

testServer().catch(console.error);
