import { app } from "./app.js";
import env from "dotenv";
env.config();

const PORT = process.env.SERVER_APP_PORT;

try {
  app.listen(PORT, () => {
    console.log(`Application is running on http://localhost:${PORT}`);
    console.log(`GraphQL is running on http://localhost:${PORT}/graphql`);
  });
} catch (error) {
  console.error(`Failed to start server: ${error.message}`);
}
