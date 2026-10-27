import { DataSource } from "typeorm";
import { Space, SpaceType } from "../entities/Space";

interface SpaceSeedItem {
  name: string;
  description: string;
  type: SpaceType;
  pricePerHour: number;
  capacity: number;
  imageUrl: string;
  isActive: boolean;
}

const SAMPLE_SPACES: SpaceSeedItem[] = [
  {
    name: "Hot Desk Ágora",
    description: "Puesto flexible en zona abierta con luz natural, conexión de alta velocidad y acceso a café.",
    type: "desk",
    pricePerHour: 15.000,
    capacity: 1,
    imageUrl: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
  },
  {
    name: "Dedicated Desk Focus",
    description: "Puesto fijo ergonómico con monitor secundario, gaveta con cerradura y ambiente silencioso.",
    type: "desk",
    pricePerHour: 22.500,
    capacity: 1,
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
  },
  {
    name: "Sala de Innovación",
    description: "Sala para lluvia de ideas con pizarra de cristal, pantalla interactiva de 65'' y videoconferencia.",
    type: "meeting_room",
    pricePerHour: 45.000,
    capacity: 6,
    imageUrl: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
  },
  {
    name: "Sala de Juntas Boardroom",
    description: "Espacio ejecutivo acústicamente aislado con mesa de conferencias, microfonía omnidireccional y pantalla 4K.",
    type: "meeting_room",
    pricePerHour: 85.000,
    capacity: 12,
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
  },
  {
    name: "Oficina Privada Nexus",
    description: "Oficina privada completamente equipada para equipos en crecimiento, con control de acceso digital.",
    type: "private_office",
    pricePerHour: 65.000,
    capacity: 4,
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
  },
  {
    name: "Suite Corporativa Apex",
    description: "Espacio premium con sala de reuniones interna, área de café y vistas panorámicas a la ciudad.",
    type: "private_office",
    pricePerHour: 110.000,
    capacity: 8,
    imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
  },
  {
    name: "Taller Creativo (En Renovación)",
    description: "Espacio reservado para pruebas de mantenimiento y actualización de mobiliario.",
    type: "desk",
    pricePerHour: 10.000,
    capacity: 1,
    imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    isActive: false,
  },
];

export async function seedSpaces(dataSource: DataSource): Promise<Space[]> {
  const spaceRepository = dataSource.getRepository(Space);
  const createdOrExistingSpaces: Space[] = [];

  for (const item of SAMPLE_SPACES) {
    let space = await spaceRepository.findOne({ where: { name: item.name } });

    if (!space) {
      space = spaceRepository.create(item);
      await spaceRepository.save(space);
      console.log(`[Seed Spaces] Espacio creado: ${item.name} (${item.type})`);
    } else {
      console.log(`[Seed Spaces] Espacio ya existente: ${item.name}`);
    }

    createdOrExistingSpaces.push(space);
  }

  return createdOrExistingSpaces;
}

