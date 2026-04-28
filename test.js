import { format, TYPES, RESOLVERS } from './src/index.js';
import assert from 'node:assert';

function it(name, fn) {
  try { fn(); console.log(`  ok ${name}`); }
  catch (e) { console.error(`  FAIL ${name}: ${e.message}`); process.exitCode = 1; }
}

console.log('dotdig smoke tests');

it('TYPES has core records', () => {
  for (const t of ['A', 'AAAA', 'MX', 'TXT', 'NS']) {
    assert.ok(TYPES.includes(t), `missing ${t}`);
  }
});

it('RESOLVERS has cloudflare', () => {
  assert.ok(RESOLVERS.cloudflare.includes('1.1.1.1'));
});

it('format renders A records', () => {
  const out = format('example.com', [
    { type: 'A', records: ['1.2.3.4', '5.6.7.8'] },
  ]);
  assert.match(out, /A\s+1\.2\.3\.4/);
  assert.match(out, /A\s+5\.6\.7\.8/);
});

it('format renders MX records', () => {
  const out = format('example.com', [
    { type: 'MX', records: [{ priority: 10, exchange: 'mx1.example.com' }] },
  ]);
  assert.match(out, /MX\s+10\s+mx1\.example\.com/);
});

it('format renders error', () => {
  const out = format('example.com', [{ type: 'A', error: 'ENOTFOUND' }]);
  assert.match(out, /A\s+\(ENOTFOUND\)/);
});

it('format renders no records', () => {
  const out = format('example.com', [{ type: 'AAAA', records: [] }]);
  assert.match(out, /AAAA\s+\(no records\)/);
});

console.log('done');
