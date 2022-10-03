### Up and Running

1 - Install the node version 16.17.0

2 - Run the `npm install` command

3 - Run the following command to run DB migrations: `npm run db:migrate`

4 - Run the following command to run DB seeds: `npm run db:seed:all`

5 - Run the `npm start` command to start the application (default port is 3001)

6 - Access the Swagger UI url to make some calls: http://localhost:3001/api-docs/

### Running test

Run the `npm test` command

The base api is using basic auth to authenticate each request. The default user is `base-api` and the password is `base@123`. You'll need to provide it by clicking on the "Authorize" button on the Swagger URL.
