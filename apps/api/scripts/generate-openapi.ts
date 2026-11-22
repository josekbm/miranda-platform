process.env.DATABASE_URL ??= "postgresql://miranda:miranda@localhost:5432/miranda";
process.env.JWT_SECRET ??= "openapi-generation-secret-change-me";
process.env.COOKIE_SECRET ??= "openapi-generation-cookie-change-me";
process.env.API_URL ??= "http://localhost:3000";

import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

async function main(): Promise<void> {
  const { buildApp } = await import("../src/app");
  const app = buildApp({ logger: false });

  await app.ready();
  const document = app.swagger();
  await writeFile(resolve("openapi.json"), `${JSON.stringify(document, null, 2)}\n`, "utf8");
  await app.close();

  console.log("OpenAPI generated at apps/api/openapi.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
