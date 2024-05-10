# Thiago's submission

## How to run it

1. cd to `apps/backend` and execute `docker compose up -d`

## How to test it

1. cd to `apps/backend`, execute `docker compose up -d`
2. execute `yarn migrate` to scaffold the database tables
3. run `yarn test:e2e` or `yarn test`.

## Key points

These are the key decision I made and some context to their why's:

- **No monorepo manager**. I chose not to use a monorepo manager like NX here for simplicity.
- **Focus on e2e tests**. Usually when I start a new project that I know will change a lot, I tend to invest more into e2e tests. That's because these types of tests have a better "Resistance to Refactoring" - which means we have more freedom to change the underlying code, while keeping the behavior untouched and validated.
- **Use of DSL for e2e tests**. You'll notice e2e tests are using a DSL abstraction. This makes these tests more readable, maintainable, and also resistant to changes. It also fosters reusability, as we have application features exposed in a nice API.
- **Use of Kysely (Query Builder) instead of ORM**. ORM's can be quite cumbersome to setup, configure, and utilize. Kysely can be quickly adopted, and the developer don't have to learn a whole new API for dealing with the database - we can just use SQL as we know it.
- **Separation of Layers**. The `wage` module is subdivided into domain, application, infra, and presentation layers to improve its maintainability. However, I didn't apply vanilla clean architecture here - I don't use interfaces when communicating between layers.
That's because early abstraction is a common pitfall, and I prefer to focus on solid E2E tests to give us freedom to change the code
later, if necessary. For a more in-depth discussion of that, you can check out [my article](https://dev.to/thiagomini/dont-go-all-in-clean-architecture-an-alternative-for-nestjs-applications-p53)
- **Exchange Ratios in APP**. I chose to keep the exchange ratio between USD and ARS as a constant in the application - just for simplicity's sake again. In a real app this would probably come from a third-party API or the database.
- **Use of both OOP and functional domain**. The domain layer uses both OOP (Money class) and functional paradigm (withdraw). That's just to demonstrate how we can use both in that layer.
