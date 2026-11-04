---
paths: ["src/components/**/*.tsx"]
---
Date: 2026-10-26
Reason: Story 1.2 (commit 7c11e0b) had a bug found in review and fixed in 4651dca. `MediaPlayer` cleanup removed `src`; StrictMode re-ran the effect and nothing set `src` back, so nothing played in dev.

Rule: a `useEffect` must work when React runs effect, cleanup, effect again. Whatever cleanup tears down, the effect setup must rebuild.

Bad:
    useEffect(() => { return () => el.removeAttribute('src'); }, [url]);  // second run: no src
Good:
    useEffect(() => {
      if (el.getAttribute('src') !== url) el.setAttribute('src', url);
      return () => el.removeAttribute('src');
    }, [url]);

Note: not enforced automatically (components have no tests, see manual-verification.md). Check by hand in dev mode.
