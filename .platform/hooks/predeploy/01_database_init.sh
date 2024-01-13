#!/usr/bin/env bash

# Add database migration script
node node_modules/prisma/build/index.js migrate resolve --applied 20240109151719_submission_ispulic
node node_modules/prisma/build/index.js migrate resolve --applied 20240113073649_problem_issue_comment