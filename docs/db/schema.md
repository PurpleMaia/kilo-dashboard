# Database Schema

## metric_type
| Column    | Type        | Description |
|-----------|------------|-------------|
| id        | integer (PK) | Primary key |
| type_name | text       | Name of the metric type |
| unit      | text       | Unit of measurement |
| category  | text       | Metric category (soil, water, sensor) |

---

## sensor
| Column | Type          | Description |
|--------|--------------|-------------|
| id     | integer (PK) | Primary key |
| name   | text         | Sensor name |
| serial | text         | Serial number |

---

## metric (readings)
| Column       | Type          | Description |
|--------------|--------------|-------------|
| id           | integer (PK) | Primary key |
| value        | numeric      | Measured value |
| timestamp    | datetime     | Time of measurement |
| metric_type_id | integer (FK → metric_type.id) | Metric type |
| sensor_id    | integer (FK → sensor.id) | Sensor reference |
| mala_id      | integer (FK → mala.id) | Mala reference |

---

## mala (zone of readings)
| Column     | Type          | Description |
|------------|--------------|-------------|
| id         | integer (PK) | Primary key |
| name       | text         | Mala name |
| created_at | datetime     | Creation timestamp |
| aina_id    | integer (FK → aina.id) | Associated Aina |

---

## aina (region)
| Column     | Type          | Description |
|------------|--------------|-------------|
| id         | integer (PK) | Primary key |
| name       | text         | Aina name |
| created_at | datetime     | Creation timestamp |

---

## profile
| Column   | Type          | Description |
|----------|--------------|-------------|
| id       | integer (PK) | Primary key |
| aina_id  | integer (FK → aina.id) | Associated Aina |
| role     | text         | User role (not yet established) |
| user_id  | integer (FK → user.id) | User reference |

---

## ag_test_files (not in use yet)
| Column      | Type          | Description |
|-------------|--------------|-------------|
| id          | integer (PK) | Primary key |
| user_id     | integer (FK → user.id) | Uploader |
| aina_id     | integer (FK → aina.id) | Related Aina |
| test_type   | text         | Test type |
| file_name   | text         | File name |
| file_content| blob         | File content |
| file_size   | integer      | File size |
| mime_type   | text         | MIME type |
| uploaded_at | datetime     | Upload timestamp |

---

## kilo
| Column      | Type          | Description |
|-------------|--------------|-------------|
| id          | integer (PK) | Primary key |
| user_id     | integer (FK → user.id) | User reference |
| observation | text         | Observation notes |
| timestamp   | datetime     | Time of observation |

---

## user
| Column        | Type          | Description |
|---------------|--------------|-------------|
| id            | integer (PK) | Primary key |
| username      | text         | Username |
| password_hash | text         | Hashed password |
| email         | text         | Email address |
| email_verified| boolean      | Email verification status |
| created_at    | datetime     | Account creation time |

---

## usersession
| Column     | Type          | Description |
|------------|--------------|-------------|
| id         | integer (PK) | Primary key |
| expires_at | datetime     | Session expiration |
| user_id    | integer (FK → user.id) | User reference |

---

## useraccesstoken (not in use yet)
| Column     | Type          | Description |
|------------|--------------|-------------|
| id         | integer (PK) | Primary key |
| token_type | text         | Token type |
| code       | text         | Access token code |
| created_at | datetime     | Creation timestamp |
| expires_at | datetime     | Expiration timestamp |
| user_id    | integer (FK → user.id) | User reference |

---

## user_oauth (not in use yet)
| Column          | Type          | Description |
|-----------------|--------------|-------------|
| id              | integer (PK) | Primary key |
| provider_id     | text         | OAuth provider ID |
| provider_user_id| text         | Provider-specific user ID |
| user_id         | integer (FK → user.id) | User reference |
| created_at      | datetime     | Creation timestamp |

---

## schema_migrations
| Column  | Type    | Description |
|---------|--------|-------------|
| version | text   | Migration version |
| dirty   | boolean| Dirty flag |

