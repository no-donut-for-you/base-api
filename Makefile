run-app:
	docker-compose up -d

stop-app:
	docker-compose stop

run-app-logs:
	docker logs base-api -f

run-migrations:
	docker-compose run base-api npm run db:migrate

run-migrations-undo:
	docker-compose run base-api npm run db:migrate:undo

run-migrations-undo-all:
	docker-compose run base-api npm run db:migrate:undo:all

run-seeds:
	docker-compose run base-api npm run db:seed:all

run-tests:
	docker-compose run base-api npm test

run-lint:
	docker-compose run base-api npm run lint:fix
