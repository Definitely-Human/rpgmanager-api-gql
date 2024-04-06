@echo off
IF "%1"=="e2e" (
    docker-compose -f docker-compose-test.yml run --rm api-test sh -c "npm run test:e2e:w"
    docker-compose -f docker-compose-test.yml down
) ELSE (
    docker-compose -f docker-compose-test.yml run --rm --no-deps api-test sh -c "npm run test:watch"
)