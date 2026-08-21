import app from "./app";
import { env } from "./config/env";
import { initDb } from "./db/initDb";

async function main(): Promise<void> {
  try {
    await initDb();
    app.listen(env.port, () => {
      console.log(`Serveur démarré sur http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Échec du démarrage du serveur :", error);
    process.exit(1);
  }
}

main();
