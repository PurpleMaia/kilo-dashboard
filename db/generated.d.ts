/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type Category = "air" | "sensor" | "soil" | "stream" | "water";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface AgTestFiles {
  aina_id: number;
  file_content: Buffer;
  file_name: string;
  file_size: number;
  id: Generated<number>;
  mime_type: string;
  test_type: string;
  uploaded_at: Generated<Timestamp>;
  user_id: string;
}

export interface Aina {
  created_at: Timestamp | null;
  id: Generated<number>;
  name: string | null;
}

export interface Mala {
  aina_id: number | null;
  created_at: Timestamp | null;
  id: Generated<number>;
  name: string | null;
}

export interface Metric {
  id: Generated<number>;
  metric_type: number | null;
  sensor_id: number | null;
  timestamp: Timestamp | null;
  value: number | null;
}

export interface MetricType {
  category: Category | null;
  id: Generated<number>;
  type_name: string | null;
  unit: string | null;
}

export interface Profile {
  aina_id: number | null;
  role: string | null;
  user_id: string | null;
}

export interface SchemaMigrations {
  dirty: boolean;
  version: Int8;
}

export interface Sensor {
  id: Generated<number>;
  name: string | null;
  serial: string | null;
}

export interface SensorMala {
  created_at: Generated<Timestamp | null>;
  id: Generated<number>;
  mala_id: number | null;
  sensor_id: number | null;
}

export interface User {
  created_at: Generated<Timestamp>;
  email: string | null;
  email_verified: Generated<boolean | null>;
  id: string;
  password_hash: string | null;
  username: string;
}

export interface Useraccesstoken {
  code: string;
  created_at: Generated<Timestamp>;
  expires_at: Generated<Timestamp>;
  id: Generated<number>;
  token_type: string;
  user_id: string;
}

export interface UserOauth {
  created_at: Generated<Timestamp>;
  id: string;
  provider_id: string;
  provider_user_id: string;
  user_id: string;
}

export interface Usersession {
  expires_at: Timestamp;
  id: string;
  user_id: string;
}

export interface DB {
  ag_test_files: AgTestFiles;
  aina: Aina;
  mala: Mala;
  metric: Metric;
  metric_type: MetricType;
  profile: Profile;
  schema_migrations: SchemaMigrations;
  sensor: Sensor;
  sensor_mala: SensorMala;
  user: User;
  user_oauth: UserOauth;
  useraccesstoken: Useraccesstoken;
  usersession: Usersession;
}
