run-app:
	docker-compose up -d

stop-app:
	docker-compose stop

run-app-logs:
	docker logs base-api -f

run-migrations:
	docker-compose exec base-api npm run db:migrate

run-migrations-undo:
	docker-compose exec base-api npm run db:migrate:undo

run-migrations-undo-all:
	docker-compose exec base-api npm run db:migrate:undo:all

run-seeds:
	docker-compose exec base-api npm run db:seed:all

run-elasticsearch-indices-create:
	docker-compose exec base-api npm run elasticsearch:indices:cars:create
	docker-compose exec base-api npm run elasticsearch:indices:cars:sync:data

run-tests:
	docker-compose exec base-api npm test

run-lint:
	docker-compose exec base-api npm run lint:fix
