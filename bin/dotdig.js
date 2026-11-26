#!/usr/bin/env node
import { readFileSync as __readPkgVersion } from 'node:fs';
if (process.argv[2] === '--version' || process.argv[2] === '-V') { console.log(JSON.parse(__readPkgVersion(new URL('../package.json', import.meta.url), 'utf8')).version); process.exit(0); }
import { lookup, format, RESOLVERS, TYPES } from '../src/index.js';

const args = process.argv.slice(2);

function help() {
  console.log(`dotdig: DNS lookup

Usage:
  dotdig <host>                       A, AAAA, MX, TXT and NS records
  dotdig <host> --types A,AAAA,MX     chosen record types
  dotdig <host> --all                 every supported type
  dotdig <host> --via cloudflare      ask a public resolver
  dotdig <host> --via 1.1.1.1         ask a resolver by IP
  dotdig --json <host>                print JSON
  dotdig -V, --version                print the version
  dotdig -h, --help                   show this help

Types: ${TYPES.join(', ')}
Resolvers: cloudflare, google, quad9, opendns, or one or more IPs separated by commas

Examples:
  dotdig example.com
  dotdig example.com --types MX,TXT --via cloudflare
  dotdig _ssh._tcp.example.com --types SRV

Docs and issues: https://github.com/voidd0/dotdig`);
}

if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
  help();
  process.exit(0);
}

let host;
let types = ['A', 'AAAA', 'MX', 'TXT', 'NS'];
let resolvers = null;
let wantJson = false;

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--types') types = args[++i].split(',').map(s => s.trim().toUpperCase());
  else if (a === '--all') types = [...TYPES];
  else if (a === '--via') {
    const v = args[++i];
    resolvers = RESOLVERS[v.toLowerCase()] || v.split(',').map(s => s.trim());
  } else if (a === '--json') wantJson = true;
  else if (a.startsWith('--')) { console.error(`unknown flag: ${a}`); process.exit(1); }
  else if (!host) host = a;
}

if (!host) { console.error('dotdig: no host given. try `dotdig --help`.'); process.exit(1); }

try {
  const results = await lookup(host, { types, resolvers });
  if (wantJson) {
    console.log(JSON.stringify({ host, results }, null, 2));
  } else {
    console.log(format(host, results));
  }
} catch (e) {
  console.error(`dotdig: ${e.message}`);
  process.exit(2);
}
