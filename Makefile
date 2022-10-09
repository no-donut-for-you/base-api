run-app:
	docker-compose up -d

stop-app:
	docker-compose stop

run-migrations:
	docker-compose run base-api npm run db:migrate

run-seeds:
	docker-compose run base-api npm run db:seed:all

run-app-logs:
	docker logs base-api -f

run-tests:
	docker-compose run base-api npm test
