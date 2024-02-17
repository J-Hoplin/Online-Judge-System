# Online Judge System API

- Author: J-Hoplin
- Team
  - J-Hoplin: Backend & Infrastructure
  - Oseungkwon: Frontend

## Web Scraper

Use web scraper to fill problem and problem example datas. **You need to run this scraper after you execute `Online Judge System` once.**

- [Repository](https://github.com/J-Hoplin/Online-Judge-Scraper)

## Contents

- [📦Diagram](#diagram)
- [📦Github Actions CI flow](#github-actions-ci-flow)
- [📊Test Coverage](#test-coverage)
- [🧰Technical Stack](#technical-stack)
- [✅Run Application](#run-application)
- [🐳Run Application with Docker](#run-application-with-docker)
- [🐰Run Application with Rabbit MQ worker locally](#run-application-with-rabbit-mq-locally)
- [📄Run E2E Test](#run-e2e-test)
- [📄Run Unit Test](#run-unit-test)
- [📝TODO](#todo)

## Diagram

### AWS Environment - AWS Elastic Beanstalk Worker

![](img/aws-env.png)

### Local docker environment - Rabbit MQ Worker

![](img/rmq-env.png)

## Github Actions CI flow

![](img/github-action-flow.png)

## Frontend Repository

- Author: Oseungkwon
- [Repository](https://github.com/OseungKwon/Online-Judge-System-Web)

## Test Coverage

- E2E Test: 88.12%
- Unit & Integration Test: 79.13%

## Technical Stack

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
  - Docker & Docker-Compose
  - AWS Elastic Beanstalk(EC2 Instance)
    - Node.js Runtime x2 (Worker Server & Web Server)
    - Docker Runtime x1
    - AWS Worker Communication
  - AWS Auto Scaling Group
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

## Run Application

1. Git clone repository

   ```
   git clone https://github.com/J-Hoplin/Online-Judge-System.git

   cd Online-Judge-System
   ```

2. Install dependencies

   ```
   yarn install
   ```

3. Run/Stop database with docker

   ```
   # Start
   yarn db:dev:up
   ```

   ```
   # Stop
   yarn db:dev:down
   ```

4. Sync prisma schema to database

   ```
   yarn db:push
   ```

5. Run application

   ```
   yarn dev
   ```

## Run Application with docker

1. Build docker image

   ```
   docker build -t online-judge .
   ```

2. Run with docker enviornment

   ```
   yarn docker:up
   ```

3. Remove docker environment

   ```
   yarn docker:down
   ```

## Run Application with Rabbit MQ locally

### `.env` setting to use Docker Rabbit MQ worker

To use Rabbit MQ worker, you need to set both `TYPE` and `QUEUE_TYPE` as `webserver` and `RMQ` each. **This is fundamental setting to use Rabbit MQ worker setting.**

```
TYPE="worker"

...


QUEUE_TYPE="RMQ"
RMQ_URL="amqp://root:password@rmq:5672"
RMQ_WORKER_QUEUE_NAME="JUDGE_QUEUE"

...

```

To modify docker rabbit mq worker's `.env` file, modify `.docker.worker.env`. And if you want to modify docker webserver application, modify `.docker.env`.

### How to build

1. Build docker image

   ```
   yarn docker:build
   ```

2. Run integrated application docker compose environment

   ```
   yarn docker:up
   ```

## Run E2E Test

- Config: test/jest-e2e.json
- Mock Provider: test/mock.provider.ts

1. Run database

   ```
   yarn db:dev:up
   ```

2. Initialize test database

   ```
   yarn test:init
   ```

3. Run E2E Test

   ```
   yarn test:e2e
   ```

4. Run E2E Coverage Test

   ```
   yarn test:e2e:cov
   ```

## Run Unit Test

- Config: test/jest-unit.json
- Mock Provider: test/mock.provider.ts

1. Run database

   ```
   yarn db:dev:up
   ```

2. Initialize test database

   ```
   yarn test:init
   ```

3. Run E2E Test

   ```
   yarn test:unit
   ```

4. Run E2E Coverage Test

   ```
   yarn test:unit:cov
   ```

## TODO

- [x] Apply Strategy Pattern to Asynchronous Worker
  - Use Nest.js Custom Provider
  - Rabbit MQ Strategy & AWS SQS Strategy
- [ ] Make Online Judge Server with Golang
  - Now using [Judge0](https://judge0.com) based custom server
