import { getDataSource } from "../data-source";
import { seedAdmin } from "./admin.seed";
import { seedSpaces } from "./spaces.seed";

async function runSeed(): Promise<void> {
  console.log("==========================================");
  console.log("   Iniciando proceso de Seed CoSpace      ");
  console.log("==========================================");

  const dataSource = await getDataSource();

  try {
    console.log("\n--- Sembrando Administrador ---");
    const admin = await seedAdmin(dataSource);
    console.log(`✓ Admin listo: ${admin.email}`);

    console.log("\n--- Sembrando Espacios de Ejemplo ---");
    const spaces = await seedSpaces(dataSource);
    console.log(`✓ Espacios listos: ${spaces.length} espacios configurados`);

    console.log("\n==========================================");
    console.log("   Seed completado exitosamente          ");
    console.log("==========================================");
  } catch (error) {
    console.error("\n[Error en Seed]:", error);
    process.exitCode = 1;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

void runSeed();
