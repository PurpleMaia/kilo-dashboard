## Branching Strategy
Repository is organized with branches:
- **dev** - new features are always merged to this branch 
- **main** - production branch, requires production-level code and intensive testing. PR from dev to main

When making a new feature branch, use these naming conventions: 

- **feature/*** → Task-specific branches for new features or epics.
Example: feature/kilo-dashboard-filters

- **hotfix/*** → Urgent fixes required for production issues.
Example: hotfix/fix-login-crash

- **bugfix/*** → Notable bugs found during testing, requiring refactoring or fixes.
Example: bugfix/llm-timeout-handler

- **optimize/*** → Code optimizations, addressing security
Example: optimize/integrate-react-query

## Pull Requests (PRs)
We use GitHub to monitor version control and manage reviews. Every change should go through a Pull Request. Exceptions would be quick code changes to configure on deployment. 

### PR Workflow
1. Create a branch off dev
2. Push your changes.
3. Wait for CI checks (lint, typecheck, build, tests) to pass.
4. Open a PR in GitHub.
5. Fill out the PR template.
6. Request review from a cluster/project lead
7. Cluster lead will merge to main
8. Update [CHANGELOG](CHANGELOG.md)

### PR Template
```
## Summary
- Describe what this PR does

## Details
- What you implemented
- List any database migration (and the sql code)
- Any new external APIs called or new API calls made
- If a bugfix/hotfix
- Describe the bug in technical detail
- Explain the code fix

## Checklist
[ ] CI checks pass
[ ] Documentation updated
[ ] Reviewer assigned
```

### Example PR

**Branch:** feature/kilo-journal-input

**PR Title:** Add input form to Kilo Journal page
```
## Summary
- Adds frontend input using Zod and backend support api call to insert user kilo into database

## Details
- Text based input with Zod
- Toast UI for more intuitive response of submission/error
- Made a new DB migration

-- migrate UP
CREATE TABLE IF NOT EXISTS kilo (
   id SERIAL PRIMARY KEY,
   user_id TEXT NOT NULL,
   observation TEXT NOT NULL,
   timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

   FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

-- migrate DOWN
DROP TABLE IF EXISTS kilo

New API call: /api/kilo

```