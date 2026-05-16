import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum UserRole {
	REQUESTER = "requester",
	VALIDATOR = "validator",
}

@Entity({ name: "users" })
export class User {
	@PrimaryGeneratedColumn("uuid", { name: "id" })
	id!: string;

	@Column({ name: "name", length: 12, unique: true, type: "varchar" })
	name!: string;

	@Column({ type: "enum", enum: UserRole, name: "role" })
	role!: UserRole;
}
