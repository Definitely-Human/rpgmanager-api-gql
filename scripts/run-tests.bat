docker-compose -f docker-compose-test.yml run --rm api-test sh -c "npm run test:e2e:w"
docker-compose -f docker-compose-test.yml down