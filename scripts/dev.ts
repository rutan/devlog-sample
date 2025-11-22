import 'dotenv/config';
import npmRunAll from 'npm-run-all2';

const arg = process.argv[2];
if (!arg) {
  throw new Error('No argument provided');
}

process.env.SCENARIO = arg;

process.stdout.setMaxListeners(0);
process.stderr.setMaxListeners(0);
process.stdin.setMaxListeners(0);

try {
  await npmRunAll('dev:*', {
    parallel: true,
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
    printLabel: true,
  });
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
