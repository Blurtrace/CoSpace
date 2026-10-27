import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { User } from "./User";
import { Space } from "./Space";
import { numericTransformer } from "./transformers";

export type ReservationStatus = "confirmed" | "cancelled";

@Entity({ name: "reservations" })
@Index("idx_reservations_space_time", ["spaceId", "startTime", "endTime"])
@Index("idx_reservations_user_time", ["userId", "startTime", "endTime"])
export class Reservation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "timestamp with time zone" })
  startTime!: Date;

  @Column({ type: "timestamp with time zone" })
  endTime!: Date;

  @Column({
    type: "numeric",
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  totalPrice!: number;

  @Index()
  @Column({
    type: "varchar",
    length: 20,
    default: "confirmed",
  })
  status!: ReservationStatus;

  @Column({ type: "uuid" })
  userId!: string;

  @ManyToOne(() => User, (user) => user.reservations, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ type: "uuid" })
  spaceId!: string;

  @ManyToOne(() => Space, (space) => space.reservations, {
    onDelete: "RESTRICT",
    nullable: false,
  })
  @JoinColumn({ name: "spaceId" })
  space!: Space;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt!: Date;
}

