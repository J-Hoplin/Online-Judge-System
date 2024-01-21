# Online Judge System API

---

# Diagram

![](img/diagram.png)

---

# Frontend Repository

- Author: Oseungkwon
- [Repository](https://github.com/OseungKwon/Online-Judge-System-Web)

---

# Test Coverage

- Unit Test: 79.13%
- E2E Test: 88.12%

---

# Technical Stack

- Language
  - TypeScript(Node.js v18 Runtime)
- Framework
  - Nest.js
- ORM
  - Prisma ORM
- Database(Persistence & Caching)
  - MySQL 8.0
  - Redis
  - AWS S3
- Issue Tracking
  - Sentry
- Proxy Server
  - Nginx
- Infrastructure
  - AWS Elastic Beanstalk(EC2 Instance)
    - Node.js Runtime x2 (Worker Server & Web Server)
    - Docker Runtime x1
    - AWS Worker Communication
  - Auto Scaling Group
  - AWS SQS: For worker server
  - AWS S3: Build Versioning
- Test
  - Jest
  - Jest-Extended
- CI/CD
  - Github Actions
  - Code Pipeline & Code Build
- Alert
  - Discord
