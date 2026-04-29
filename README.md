# dotdig

[![npm version](https://img.shields.io/npm/v/@v0idd0/dotdig.svg?color=A0573A)](https://www.npmjs.com/package/@v0idd0/dotdig)
[![npm downloads](https://img.shields.io/npm/dw/@v0idd0/dotdig.svg?color=1F1A14)](https://www.npmjs.com/package/@v0idd0/dotdig)
[![License: MIT](https://img.shields.io/badge/license-MIT-A0573A.svg)](LICENSE)
[![Node ≥14](https://img.shields.io/badge/node-%E2%89%A514-1F1A14)](package.json)

DNS lookup for humans — formatted output, no flag soup.

```
$ dotdig voiddo.com
dotdig: voiddo.com
A      104.21.x.x
A      172.67.x.x
AAAA   2606:4700::6810:xxxx
MX        10  mx1.improvmx.com
TXT    "v=spf1 include:_spf.improvmx.com ~all"
NS     dahlia.ns.cloudflare.com
NS     mike.ns.cloudflare.com
```

## Why dotdig

You're debugging a DNS issue at 11pm. `dig +short example.com` shows nothing — fine for scripts but useless for triage. `dig example.com` dumps half a screen of headers and authority sections. You don't need 80% of that. You need: A records, AAAA, MX, TXT, NS — aligned, sorted, with sensible defaults. dotdig is the same `dig` you already trust, formatted like a human is reading it.

## Install

```bash
npm install -g @v0idd0/dotdig
```

## Usage

```bash
# Basic — A, AAAA, MX, TXT, NS
dotdig example.com

# Specific record types
dotdig example.com --types A,AAAA

# All record types we know
dotdig example.com --all

# Use a public resolver
dotdig example.com --via cloudflare
dotdig example.com --via google
dotdig example.com --via quad9

# Custom resolver IP
dotdig example.com --via 1.1.1.1

# JSON for piping
dotdig --json example.com | jq '.results[] | select(.type == "MX")'

# SRV records
dotdig _ssh._tcp.example.com --types SRV
```

## Supported types

`A`, `AAAA`, `MX`, `TXT`, `NS`, `CNAME`, `SOA`, `PTR`, `SRV`, `CAA`.

## Public resolvers

| Alias | IPs |
|---|---|
| `cloudflare` | 1.1.1.1, 1.0.0.1 |
| `google` | 8.8.8.8, 8.8.4.4 |
| `quad9` | 9.9.9.9, 149.112.112.112 |
| `opendns` | 208.67.222.222, 208.67.220.220 |

## Compared to alternatives

| tool | output legibility | resolver picker | JSON | install |
|---|---|---|---|---|
| dotdig | aligned columns, sensible defaults | yes (`--via cloudflare`) | yes | one npm install |
| `dig +short` | one IP per line | yes (`@1.1.1.1`) | no | bundled |
| `dig` (full) | verbose, RFC-shaped | yes | no | bundled |
| `host`/`nslookup` | terse, no MX details | sometimes | no | bundled |

For automation pipelines `dig +short` remains the right answer (one record, fewer characters to parse). For interactive triage on a host you're paged into, dotdig saves a screen-worth of squinting.

## FAQ

**Why not just `dig +short`?** It strips too much. You lose record type, MX priority, TXT quoting. Fine for "give me an IP", useless when the bug is in the TXT layer.

**Does it support DoH / DoT?** Out of the box, no. `--via 1.1.1.1` uses standard UDP/53 + TCP/53 fallback. If your resolver-of-choice is behind DoH, `dnsutils` is the right tool.

**Why does `--all` skip some types?** It includes the ones we have parsers for. RRSIG, NSEC, DS, etc. are intentionally not surfaced — those are zone-signing internals, not what you're debugging at 11pm.

**Negative results?** dotdig prints `(no records)` for asked types that came back empty. Exit code is `0` either way unless the resolver itself fails.

## Programmatic API

```javascript
import { lookup, format } from '@v0idd0/dotdig';

const results = await lookup('example.com', {
  types: ['A', 'MX'],
  resolvers: ['1.1.1.1'],
});

console.log(format('example.com', results));
```

## Triage shortcuts

- **Resolver mismatch?** Run dotdig twice with `--via cloudflare` and `--via google` and `diff` the JSON. If they differ, you're caught between recursive resolvers with stale caches — usually means a recent zone change is still propagating.
- **MX troubleshooting.** Pair `dotdig example.com --types MX,TXT` with the SPF/DMARC TXT records for the same domain — most "email not delivering" tickets resolve at this single column-aligned snapshot.
- **Reverse lookup.** Use `dotdig 8.8.8.8 --types PTR` (with explicit `in-addr.arpa`-style names handled internally). Useful when a log line shows an IP and you want a hostname for it without leaving the terminal.

## More from the studio

This is one tool out of many — see [`from-the-studio.md`](from-the-studio.md) for the full lineup of vøiddo products (other CLI tools, browser extensions, the studio's flagship products and games).

## From the same studio

- **[@v0idd0/jsonyo](https://www.npmjs.com/package/@v0idd0/jsonyo)** — JSON swiss army knife, 18 commands, zero limits
- **[@v0idd0/envguard](https://www.npmjs.com/package/@v0idd0/envguard)** — stop shipping `.env` drift to staging
- **[@v0idd0/depcheck](https://www.npmjs.com/package/@v0idd0/depcheck)** — find unused dependencies in one command
- **[@v0idd0/gitstats](https://www.npmjs.com/package/@v0idd0/gitstats)** — git repo analytics, one command
- **[View all tools →](https://voiddo.com/tools/)**

## License

MIT.

---

Built by [vøiddo](https://voiddo.com/) — a small studio shipping AI-flavoured products, free dev tools, Chrome extensions and weird browser games.
