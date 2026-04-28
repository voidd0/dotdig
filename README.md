# dotdig

DNS lookup for humans — formatted output, no flag soup. Read the manual.

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

## Install

```bash
npm install -g rtfm-dotdig
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

## Why not `dig`?

`dig +short` is fine for shell scripts, but the full output is hostile to read for non-network engineers. `dotdig` formats output so the type, priority, and value are aligned in columns, with sensible defaults (A+AAAA+MX+TXT+NS — what you usually want).

## Programmatic API

```javascript
import { lookup, format } from 'rtfm-dotdig';

const results = await lookup('example.com', {
  types: ['A', 'MX'],
  resolvers: ['1.1.1.1'],
});

console.log(format('example.com', results));
```

## License

MIT — part of the [vøiddo](https://voiddo.com) tools collection.
