import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import { BookResolver } from "./resolvers/BookResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { AuthResolver } from "./resolvers/AuthResolver";
import { authChecker } from "./utils/authChecker";
import app from "./app";

const { PORT = '4000' } = process.env;

async function main() {
  await createConnection();
  const schema = await buildSchema({
    authChecker,
    resolvers: [
      AuthResolver,
      BookResolver,
      UserResolver,
    ]
  });
  const server = new ApolloServer({
    context: (req) => ({ ...req }),
    schema,
  });

  server.applyMiddleware({ app });

  await app.listen(PORT, () => {
    console.log(`🔥🔥🔥 Server ready at http://localhost:${PORT}${server.graphqlPath} 🔥🔥🔥`);
  });
}

main();
