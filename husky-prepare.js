const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  console.log('Setting up husky on dev environment');
  require('husky').install();
}
