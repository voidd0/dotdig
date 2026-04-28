// dotdig — dns lookup for humans.
//
// Wraps node:dns/promises with a uniform output shape. Supports A, AAAA, MX,
// TXT, NS, CNAME, SOA, PTR, SRV, CAA. Custom resolvers via Resolver instance.
// Zero deps.

import { Resolver } from 'node:dns/promises';

export const TYPES = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA', 'PTR', 'SRV', 'CAA'];

export async function lookup(host, opts = {}) {
  const { types = ['A', 'AAAA', 'MX', 'TXT', 'NS'], resolvers = null } = opts;
  const resolver = new Resolver();
  if (resolvers && resolvers.length > 0) resolver.setServers(resolvers);

  const out = [];
  for (const t of types) {
    const upper = t.toUpperCase();
    if (!TYPES.includes(upper)) {
      out.push({ type: upper, error: 'unsupported type' });
      continue;
    }
    try {
      let records;
      switch (upper) {
        case 'A':     records = await resolver.resolve4(host); break;
        case 'AAAA':  records = await resolver.resolve6(host); break;
        case 'MX':    records = await resolver.resolveMx(host); break;
        case 'TXT':   records = await resolver.resolveTxt(host); break;
        case 'NS':    records = await resolver.resolveNs(host); break;
        case 'CNAME': records = await resolver.resolveCname(host); break;
        case 'SOA':   records = [await resolver.resolveSoa(host)]; break;
        case 'PTR':   records = await resolver.resolvePtr(host); break;
        case 'SRV':   records = await resolver.resolveSrv(host); break;
        case 'CAA':   records = await resolver.resolveCaa(host); break;
      }
      out.push({ type: upper, records });
    } catch (err) {
      out.push({ type: upper, error: err.code || err.message });
    }
  }
  return out;
}

function formatRecord(type, r) {
  switch (type) {
    case 'A':
    case 'AAAA':
      return r;
    case 'MX':
      return `${String(r.priority).padStart(4, ' ')}  ${r.exchange}`;
    case 'TXT':
      return Array.isArray(r) ? `"${r.join('')}"` : `"${r}"`;
    case 'NS':
    case 'CNAME':
    case 'PTR':
      return r;
    case 'SOA':
      return `mname=${r.nsname} rname=${r.hostmaster} serial=${r.serial} refresh=${r.refresh} retry=${r.retry} expire=${r.expire} minttl=${r.minttl}`;
    case 'SRV':
      return `prio=${r.priority} weight=${r.weight} port=${r.port} ${r.name}`;
    case 'CAA':
      return JSON.stringify(r);
    default:
      return JSON.stringify(r);
  }
}

export function format(host, results) {
  const lines = [];
  lines.push(`dotdig: ${host}`);
  for (const r of results) {
    if (r.error) {
      lines.push(`${r.type.padEnd(6)} (${r.error})`);
      continue;
    }
    if (r.records.length === 0) {
      lines.push(`${r.type.padEnd(6)} (no records)`);
      continue;
    }
    for (const rec of r.records) {
      lines.push(`${r.type.padEnd(6)} ${formatRecord(r.type, rec)}`);
    }
  }
  return lines.join('\n');
}

export const RESOLVERS = {
  cloudflare: ['1.1.1.1', '1.0.0.1'],
  google:     ['8.8.8.8', '8.8.4.4'],
  quad9:      ['9.9.9.9', '149.112.112.112'],
  opendns:    ['208.67.222.222', '208.67.220.220'],
};
