---
name: verify-commit
description: runs npm run check and if it passes, commit the changes with a provided message
---

# verify-commit

Use the commit message the user provided as `<message>`.

1. Run `npm run check`.
2. If the checks pass, run `git commit -am '<message>'`.
3. If the checks fail, do not commit. Report the errors to the user.
