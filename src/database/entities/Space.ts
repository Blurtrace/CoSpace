import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from "typeorm";
import type { Reservation } from "./Reservation";
import { numericTransformer } from "./transformers";

export type SpaceType = "desk" | "meeting_room" | "private_office";

@Entity({ name: "spaces" })
export class Space {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({
    type: "varchar",
    length: 50,
    default: "desk",
  })
  type!: SpaceType;

  @Column({
    type: "numeric",
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  pricePerHour!: number;

  @Column({ type: "int", default: 1 })
  capacity!: number;

  @Column({ type: "varchar", length: 500, nullable: true })
  imageUrl!: string | null;

  @Index()
  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @OneToMany("Reservation", (reservation: Reservation) => reservation.space)
  reservations!: Reservation[];

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt!: Date;
}
