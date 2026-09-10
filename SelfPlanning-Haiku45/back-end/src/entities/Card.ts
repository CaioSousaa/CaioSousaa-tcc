import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { List } from "./List";

@Entity("cards")
export class Card {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  listaId!: string;

  @ManyToOne(() => List, { onDelete: "CASCADE" })
  @JoinColumn({ name: "listaId" })
  lista!: List;

  @Column({ length: 100 })
  titulo!: string;

  @Column({ nullable: true, type: "text" })
  descricao?: string;

  @Column()
  ordem!: number;

  @CreateDateColumn()
  dataCriacao!: Date;

  @UpdateDateColumn()
  dataAtualizacao!: Date;
}
