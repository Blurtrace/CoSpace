import "reflect-metadata";
import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import type { RefreshToken } from "./RefreshToken";
import type { Reservation } from "./Reservation";

export type UserRole = "admin" | "user";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({
    type: "varchar",
    length: 20,
    default: "user",
  })
  role!: UserRole;

  @OneToMany("RefreshToken", (refreshToken: RefreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshTokens!: RefreshToken[];

  @OneToMany("Reservation", (reservation: Reservation) => reservation.user)
  reservations!: Reservation[];

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt!: Date;
}

