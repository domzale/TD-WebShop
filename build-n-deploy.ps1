docker build -t app-frontend ./frontend
docker build -t app-backend ./backend
docker-compose up -d --force-recreate --no-deps --remove-orphans backend frontend 