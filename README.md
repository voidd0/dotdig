# dotdig

Looks up DNS records from the command line, with a choice of public resolver and JSON output. Use it to check an A, MX or TXT record without dig installed.

[![npm](https://img.shields.io/npm/v/@v0idd0/dotdig?color=00f6d0&labelColor=050914)](https://www.npmjs.com/package/@v0idd0/dotdig)
[![test](https://github.com/voidd0/dotdig/actions/workflows/test.yml/badge.svg)](https://github.com/voidd0/dotdig/actions/workflows/test.yml)
[![license](https://img.shields.io/badge/license-MIT-00f6d0?labelColor=050914)](LICENSE)

## Install

```bash
npm install -g @v0idd0/dotdig
```

Or run it once without installing: `npx @v0idd0/dotdig --help`. Needs Node.js 18 or newer. No dependencies.

## Example

Look up the A and MX records of example.com. Output from a real run on 2026-11-26:

```console
$ dotdig example.com --types A,MX
dotdig: example.com
A      104.20.23.154
A      172.66.147.243
MX        0  
```

Ask a public resolver for TXT records:

```console
$ dotdig example.com --types TXT --via cloudflare
dotdig: example.com
TXT    "v=spf1 -all"
TXT    "_k2n1y4vw3qtb4skdx9e7dxt97qrmmq9"
```

## Usage

```text
dotdig: DNS lookup

Usage:
  dotdig <host>                       A, AAAA, MX, TXT and NS records
  dotdig <host> --types A,AAAA,MX     chosen record types
  dotdig <host> --all                 every supported type
  dotdig <host> --via cloudflare      ask a public resolver
  dotdig <host> --via 1.1.1.1         ask a resolver by IP
  dotdig --json <host>                print JSON
  dotdig -V, --version                print the version
  dotdig -h, --help                   show this help

Types: A, AAAA, MX, TXT, NS, CNAME, SOA, PTR, SRV, CAA
Resolvers: cloudflare, google, quad9, opendns, or one or more IPs separated by commas

Examples:
  dotdig example.com
  dotdig example.com --types MX,TXT --via cloudflare
  dotdig _ssh._tcp.example.com --types SRV

Docs and issues: https://github.com/voidd0/dotdig
```

## Notes

Answers come from the resolver your system uses unless you pass `--via`. Live DNS data changes, so your output will not match the example above.

## License

MIT, see [LICENSE](LICENSE).

---

Made by [vøiddo](https://voiddo.com/?src=gh). More command line tools: [voiddo.com/packages](https://voiddo.com/packages/?src=gh).
We also run data scrapers for job boards, shops and ad libraries: [voiddo.com/scrapers](https://voiddo.com/scrapers/?src=gh).
