import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const svg = await readFile(join(publicDir, 'og.svg'));
const png = await sharp(svg).resize(1200, 630).png({ quality: 90 }).toBuffer();
await writeFile(join(publicDir, 'og.png'), png);

console.log(`og.png generated (${png.byteLength} bytes)`);
