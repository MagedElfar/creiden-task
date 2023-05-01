import { Entity, Column, ObjectIdColumn, CreateDateColumn, UpdateDateColumn, ObjectId, PrimaryColumn } from 'typeorm';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}


@Entity({ name: "users" })
export class User {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    image: string;

    @Column()
    imageRelativePath: string

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}