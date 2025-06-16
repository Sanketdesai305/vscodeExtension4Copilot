const { spawn } = require('child_process');

// Replace this with the full path you found from `where npx`
const npxPath = 'C:\\Program Files\\nodejs\\npx.cmd';

const child = spawn(npxPath, ['-y', '@sanketdesaiecanarys/sankets-mcp-server'], {
  stdio: ['pipe', 'pipe', 'inherit']
});

child.stdout.on('data', (data) => {
  console.log('OUTPUT:', data.toString());
});

child.stdin.write(`Content-Length: 58\r\n\r\n{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}`);
