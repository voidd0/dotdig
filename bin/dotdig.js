#!/usr/bin/env node
import { lookup, format, RESOLVERS, TYPES } from '../src/index.js';

const args = process.argv.slice(2);

function help() {
  console.log(`
dotdig — dns lookup for humans.

  dotdig <host>                       a + aaaa + mx + txt + ns
  dotdig <host> --types A,AAAA,MX     specific types
  dotdig <host> --all                 all supported types
  dotdig <host> --via cloudflare      use a public resolver
  dotdig <host> --via 1.1.1.1         use a custom resolver ip
  dotdig --json <host>                json output
  dotdig -h, --help                   show this

types: ${TYPES.join(', ')}

resolvers: cloudflare, google, quad9, opendns, or any ip[,ip]

examples:
  dotdig voiddo.com
  dotdig voiddo.com --all --via cloudflare
  dotdig _ssh._tcp.example.com --types SRV
`);
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
