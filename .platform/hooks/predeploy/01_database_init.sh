#!/usr/bin/env bash

# Add database migration script
node node_modules/prisma/build/index.js migrate resolve --applied 20240109151719_submission_ispulic
node node_modules/prisma/build/index.js migrate resolve --applied 20240113073649_problem_issue_comment
node node_modules/prisma/build/index.js migrate resolve --applied 20240113161205_problem_issue_comment_user
node node_modules/prisma/build/index.js migrate resolve --applied 20240114010304_chagne_issue_comment_name
node node_modules/prisma/build/index.js migrate resolve --applied 20240114021108_issue_comment_problem_relation
node node_modules/prisma/build/index.js migrate resolve --applied 20240114021239_modify_problem_issue_problem
