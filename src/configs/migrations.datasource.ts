
import { DataSource } from 'typeorm';
import { typeormConfig } from './migrations.config';
export const dataSource = new DataSource(typeormConfig);
