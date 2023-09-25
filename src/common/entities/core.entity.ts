import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
