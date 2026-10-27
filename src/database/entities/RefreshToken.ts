import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "refresh_tokens" })
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "varchar", length: 255 })
  hashedToken!: string;

  @Column({ type: "timestamp with time zone" })
  expiresAt!: Date;

  @Column({ type: "boolean", default: false })
  isRevoked!: boolean;

  @Column({ type: "uuid" })
  userId!: string;

  @ManyToOne(() => User, (user) => user.refreshTokens, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "userId" })
  user!: User;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;
}
