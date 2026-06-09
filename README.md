# findmygym

If you are getting `Error [NeonDbError]: Error connecting to database: TypeError: fetch failed` error, try adding this to `~/.bashrc`:

```bash
export NODE_OPTIONS="--network-family-autoselection-attempt-timeout=500"
```
