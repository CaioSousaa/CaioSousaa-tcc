import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { List } from "./List";

@Entity("cards")
export class Card {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 0 })
  position!: number;

  @ManyToOne(() => List, (list) => list.cards, { onDelete: "CASCADE" })
  @JoinColumn({ name: "listId" })
  list!: List;

  @Column()
  listId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
