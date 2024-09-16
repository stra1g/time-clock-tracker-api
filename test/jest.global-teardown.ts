import { execSync } from 'child_process';

export default async function globalTeardown() {
  try {
    console.log('Rolling back migrations...');
    execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
    console.log('Migrations rolled back successfully');
  } catch (error) {
    console.error('Error rolling back migrations:', error);
  }
}
