import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fileName = 'administrators.txt';

export function checkPermission(username) {
  const file = fs.readFileSync(path.resolve(__dirname, `${fileName}`), 'utf8');
  const usernames = file.split(';').map(un => un.replace(/\n/g, '').trim());
  return usernames.includes(username);
}
