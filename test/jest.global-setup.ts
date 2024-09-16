import 'dotenv/config';
import { execSync } from 'child_process';

export default async function globalSetup() {
  console.log('Running migrations for test database...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('Migrations completed.');
}
