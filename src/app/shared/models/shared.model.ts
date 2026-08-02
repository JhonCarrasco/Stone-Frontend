import { BaseEntity } from './baseEntity.model';

export interface Shared<T> extends BaseEntity {
  description: T | null;
}
