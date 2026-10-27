import { DataSource } from "typeorm";
import bcrypt from "bcryptjs";
import { User } from "../entities/User";

export async function seedAdmin(dataSource: DataSource): Promise<User> {
  const userRepository = dataSource.getRepository(User);

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@cospacex.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin1234!";

  let admin = await userRepository.findOne({ where: { email: adminEmail } });

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

  if (!admin) {
    admin = userRepository.create({
      name: "CoSpace Administrator",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });
    await userRepository.save(admin);
    console.log(`[Seed Admin] Administrador creado: ${adminEmail}`);
  } else {
    // Si ya existe, nos aseguramos de que conserve el rol admin
    if (admin.role !== "admin") {
      admin.role = "admin";
      await userRepository.save(admin);
      console.log(`[Seed Admin] Usuario ${adminEmail} actualizado a rol admin`);
    } else {
      console.log(`[Seed Admin] Administrador ya existente: ${adminEmail}`);
    }
  }

  return admin;
}

