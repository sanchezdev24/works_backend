
# 1. Levantar solo PostgreSQL
docker compose up -d

# 2. Verificar que esté sano
docker compose ps
# works_postgres   Up (healthy)

# 3. Instalar dependencias del proyecto
npm install

# 4. Ejecutar migraciones (crea la tabla jobs con ENUMs e índices)
npm run migration:run

# 5. Iniciar el backend en modo desarrollo
npm run start:dev