import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Board } from "./entities/Board";
import { List } from "./entities/List";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
  database: process.env.POSTGRES_DB || "tcc_db",
  entities: [User, Board, List],
  synchronize: true,
  logging: false,
});
