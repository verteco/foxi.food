# Foxi.food Application

Multi-tenant food ordering platform built with Django REST Framework and React.

## Tech Stack

- **Backend**: Django 4.2, Django REST Framework, PostgreSQL
- **Frontend**: React, TypeScript, Tailwind CSS
- **Deployment**: Docker, Digital Ocean App Platform

## Local Development

### Using Docker Compose

```bash
# Start all services
docker-compose up

# Backend will be available at http://localhost:8000
# Frontend will be available at http://localhost:3000
```

### Manual Setup

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## Deployment to Digital Ocean

### Prerequisites
1. Digital Ocean account
2. GitHub repository connected to Digital Ocean

### Deployment Steps

1. **Create App on Digital Ocean**
   - Go to Digital Ocean App Platform
   - Click "Create App"
   - Connect your GitHub repository (verteco/foxi.food)
   - Select the main branch

2. **Configure App Components**
   - The app will automatically detect the `.do/app.yaml` configuration
   - Review the settings for backend and frontend services
   - Configure the PostgreSQL database

3. **Set Environment Variables**
   In the Digital Ocean App settings, set these variables:
   
   **Backend Service:**
   - `SECRET_KEY`: Generate a secure Django secret key
   - `DATABASE_URL`: (automatically set by Digital Ocean)
   - `ALLOWED_HOSTS`: Your app domain (e.g., `foxi-food.ondigitalocean.app`)
   - `CORS_ALLOWED_ORIGINS`: Your frontend URL
   
   **Frontend Service:**
   - `REACT_APP_API_URL`: Your backend service URL

4. **Deploy**
   - Click "Deploy" to start the deployment process
   - Monitor the build logs for any issues

### Post-Deployment

1. **Run Database Migrations**
   ```bash
   # Connect to your app console on Digital Ocean
   python manage.py migrate
   python manage.py createsuperuser  # Create admin user
   ```

2. **Configure Custom Domain** (Optional)
   - Add your custom domain in App Settings
   - Update DNS records as instructed

## Project Structure

```
foxi.food/
├── backend/
│   ├── foxi_food_backend/    # Main Django settings
│   ├── tenants/               # Multi-tenancy app
│   ├── restaurant_app/        # Restaurant management
│   ├── menu_app/             # Menu management
│   ├── order_app/            # Order processing
│   ├── utility_app/          # Utility endpoints
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   └── App.tsx          # Main app component
│   ├── public/              # Static assets
│   └── package.json         # Node dependencies
├── docker-compose.yml       # Local development setup
└── .do/app.yaml            # Digital Ocean configuration
```

## Features

- Multi-tenant architecture
- Restaurant browsing and search
- Menu display with categories
- Order management
- JWT authentication
- Responsive design

## API Documentation

### Authentication
- POST `/api/token/` - Get JWT token
- POST `/api/token/refresh/` - Refresh token

### Restaurants
- GET `/api/restaurants/` - List all restaurants
- GET `/api/restaurants/{id}/` - Get restaurant details

### Menu
- GET `/api/menu/restaurants/{id}/menu/` - Get restaurant menu

### Orders
- POST `/api/orders/` - Create new order
- GET `/api/orders/{id}/` - Get order details

## License

Private repository - All rights reserved
