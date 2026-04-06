# FraudShield - Cyber Safety Platform

FraudShield helps users search and report suspicious phone numbers, UPI IDs, and URLs for fraud, scams, and cyber abuse.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ Features

- 🔍 Search phone numbers, UPI IDs, URLs for fraud reports
- 📱 Report suspicious entities with evidence upload
- 🎯 AI-powered risk scoring (0-100)
- 👮‍♂️ Admin panel with report approval/rejection
- 📊 Dashboard analytics & recent reports
- 📱 Fully responsive modern UI (Tailwind CSS)
- 🛡️ Production-ready security (JWT, rate limiting, validation)
- 🚀 Easy deployment (PM2 + Nginx + PostgreSQL)

## 🛠 Tech Stack

**Frontend:** React 18 + Vite + Tailwind CSS + React Router
**Backend:** Node.js + Express + Prisma + PostgreSQL
**Auth:** JWT + bcrypt
**Validation:** Zod (frontend/backend)
**File Upload:** Multer
**Deployment:** PM2 + Nginx

## 🚀 Quick Start (Local Development)

### 1. Clone & Install

```bash
cd fraudshield
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` in both `backend/` and `frontend/`:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env  # Optional for frontend CORS
```

**backend/.env:**
```
DATABASE_URL=\"postgresql://username:password@localhost:5432/fraudshield?schema=public\"
JWT_SECRET=\"your-super-secret-jwt-key-min-32-chars\"
PORT=5000
ADMIN_EMAIL=\"admin@fraudshield.com\"
ADMIN_PASSWORD=\"AdminPass123!\"
UPLOAD_DIR=\"./uploads\"
FRONTEND_URL=\"http://localhost:5173\"
NODE_ENV=\"development\"
```

### 3. Database Setup

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run Development Servers

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173`

**Default Admin Login:** `admin@fraudshield.com` / `AdminPass123!`

## 🌐 Production Deployment (Ubuntu VPS)

### 1. Server Prerequisites (Ubuntu 22.04+)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### 2. PostgreSQL Setup

```bash
sudo -u postgres psql
CREATE DATABASE fraudshield;
CREATE USER fraudshield WITH PASSWORD 'strongpassword';
GRANT ALL PRIVILEGES ON DATABASE fraudshield TO fraudshield;
\\q
```

Update `DATABASE_URL` in `.env`.

### 3. Deploy Backend

```bash
cd backend
npm install --production
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 4. Deploy Frontend

```bash
cd frontend
npm run build
sudo cp -r dist/* /var/www/fraudshield/
sudo chown -R www-data:www-data /var/www/fraudshield/
```

### 5. Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/fraudshield
```

Add `nginx.conf.example` content, then:

```bash
sudo ln -s /etc/nginx/sites-available/fraudshield /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow 5432  # PostgreSQL (internal)
sudo ufw enable
```

## 📱 API Documentation

**Base URL:** `http://localhost:5000/api`

### Public Routes
- `GET /api/search?type=phone&value=1234567890`
- `POST /api/reports`
- `GET /api/reports/recent?page=1`
- `GET /api/entities/:id`

### Admin Routes (JWT required)
- `POST /api/admin/login`
- `GET /api/admin/dashboard`
- `GET /api/admin/reports?status=pending&page=1`
- `PATCH /api/admin/reports/:id/approve`
- `PATCH /api/admin/reports/:id/reject`

## 🧪 Testing

```bash
# Backend tests (add later)
npm test

# API Test with curl
curl -X GET \"http://localhost:5000/api/search?type=url&value=phishingsite.com\"
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | - |
| `PORT` | Backend port | 5000 |
| `ADMIN_EMAIL` | Default admin email | admin@fraudshield.com |
| `ADMIN_PASSWORD` | Default admin password | AdminPass123! |
| `UPLOAD_DIR` | File uploads directory | ./uploads |
| `FRONTEND_URL` | Frontend CORS origin | http://localhost:5173 |
| `NODE_ENV` | Environment | development |

## 📁 Project Structure

```
fraudshield/
├── backend/           # Express + Prisma API
├── frontend/          # React + Vite + Tailwind
├── README.md
└── .env.example
```

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Submit PR

## 📄 License

MIT License
