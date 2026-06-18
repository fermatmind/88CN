# Seed 100 Machine-Readability Audit Dataset

This directory contains a sanitized local audit dataset for the Seed 100 project corpus.

Generated at: 2026-06-18T05:54:48.243Z

Input data commit: 1fb09e31b291d490981fe097a51da2c53dab2894
Main repo commit: fdcedcf08af8ba25105114ae656b9db4f2a31fb9

Files:

- summary.json: aggregate counts
- items.ndjson: one sanitized record per Seed 100 project
- failures.ndjson: records whose website fetch did not return a usable HTML page
- schema.json: dataset field contract

Network limits:

- concurrency max 2
- timeout 5000 ms
- max body 262144 bytes
- max redirects 2
- no JavaScript execution
- no browser automation
- no paid or AI APIs

Privacy:

The dataset stores structural booleans, status classes, reason codes, byte counts, same-origin redirect status, and website host only. It does not store raw HTML, raw headers, raw titles, raw descriptions, cookies, credentials, private contact data, or server addresses.

This dataset is internal input for the next report task. It is not a public ranking product and does not promise external visibility.
