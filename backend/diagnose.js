import { resolve4 } from 'dns/promises';
import { createConnection } from 'net';

console.log('🔍 MongoDB Connection Diagnostic\n');

// Test 1: DNS Resolution
console.log('Test 1: DNS Resolution');
try {
  const ips = await resolve4('cluster0.ywpqdfk.mongodb.net');
  console.log('✅ DNS resolved to:', ips);
} catch (err) {
  console.error('❌ DNS resolution failed:', err.message);
}

// Test 2: Network connectivity to MongoDB port
console.log('\nTest 2: Network connectivity (port 27017)');
const testConnection = (host, port, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const socket = createConnection({ host, port, timeout });
    
    socket.on('connect', () => {
      console.log(`✅ Connected to ${host}:${port}`);
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      console.error(`❌ Connection timeout to ${host}:${port}`);
      socket.destroy();
      reject(new Error('TIMEOUT'));
    });
    
    socket.on('error', (err) => {
      console.error(`❌ Connection error to ${host}:${port}:`, err.message);
      reject(err);
    });
  });
};

try {
  await testConnection('cluster0.ywpqdfk.mongodb.net', 27017);
} catch (err) {
  console.log('Note: Connection test failed (expected if DNS unresolved)');
}

// Test 3: Check environment
console.log('\nTest 3: Environment Setup');
console.log('MONGODB_URI set:', !!process.env.MONGODB_URI);
console.log('Node version:', process.version);

console.log('\n💡 If DNS resolution fails, your ISP or network may block MongoDB DNS.');
console.log('   Try changing DNS to 8.8.8.8 or use a different network.');
