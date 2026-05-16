import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
} from "typeorm";

import { User } from "./User.js";

export enum VacationStatus {
	PENDING = "pending",
	APPROVED = "approved",
	REJECTED = "rejected",
}

@Entity({ name: "vacation_requests" })
export class VacationRequest {
	@PrimaryGeneratedColumn("uuid", { name: "id" })
	id!: string;

	// --- Foreign key column (explicit DB field) ---
	@Column({ name: "user_id", type: "uuid" })
	userId!: string;

	// --- Relation (ORM-level object mapping) ---
	@ManyToOne(() => User, { onDelete: "CASCADE" })
	@JoinColumn({ name: "user_id" })
	user!: User;

	@Column({ name: "start_date", type: "date" })
	startDate!: string;

	@Column({ name: "end_date", type: "date" })
	endDate!: string;

	@Column({ name: "reason", type: "text", nullable: true })
	reason!: string | null;

	@Column({
		name: "status",
		type: "enum",
		enum: VacationStatus,
		default: VacationStatus.PENDING,
	})
	status!: VacationStatus;

	@Column({ name: "comments", type: "text" })
	comments!: string;

	@CreateDateColumn({ name: "created_at" })
	createdAt!: Date;
}
