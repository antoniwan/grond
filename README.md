# Grond

## ![Grond](http://tolkiengateway.net/w/images/e/ea/Joel_Kilpatrick_-_Morgoth_and_Fingolfin.jpg)

Uses [KeystoneJS](https://www.keystonejs.com/) please refer to its [Docs](https://www.keystonejs.com/quick-start/) for detailed instructions. This thing is **INSANE!**

## Getting Started

1. Run `yarn install`
2. Fill the .env file using the .env.example file. Use the guide below to setup a development Cloud MongoDB instance.
3. Run `yarn dev`

The following URLs will now be available!

- Keystone instance is ready at http://localhost:3000 🚀
- 🔗 Keystone Admin UI: http://localhost:3000/admin
- 🔗 GraphQL Playground: http://localhost:3000/admin/graphiql
- 🔗 GraphQL API: http://localhost:3000/admin/api

## Setup a Cloud MondoDB instance for local development

1. Sign up for a free account at [cloud.mongodb.com](https://cloud.mongodb.com/)
2. Build a free cluster
3. Add `0.0.0.0/0` as your whitelist entry
4. Choose Connection method: Connect your application
5. Create an user and use this information in the .env file

## Builds

## Tests
