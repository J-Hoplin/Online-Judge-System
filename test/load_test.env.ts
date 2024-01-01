import { config } from 'dotenv';

/**
 * Load dotenv configuration file for test
 */

config({
  path: `${__dirname}/../test.env`,
});
console.log(process.env.DATABASE_URL);
