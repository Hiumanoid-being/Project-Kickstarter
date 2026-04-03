import app from "./app.js";
import { initializeDatabase } from "./services/database.js";

const PORT = process.env.PORT || 5000;
const DB_TYPE = process.env.DB_TYPE || 'postgres';

// Initialize database connection
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Using database: ${DB_TYPE}`);
      console.log(`API available at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });