# SpendIQ Backend

Personal expense tracking API with SMS parsing capabilities.

## Features

- 🔐 JWT-based authentication
- 💰 Expense management (CRUD)
- 📁 Category management
- 📊 Dashboard & analytics
- 📱 SMS transaction parsing
- 💡 Budget tracking & alerts

## Tech Stack

- Node.js + Express.js
- MongoDB
- Mongoose ODM
- JWT Authentication
- bcrypt for password hashing

## Installation

1. Clone repository
```bash
git clone https://github.com/TheRakshitRaj/spendIQ.git
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Setup database
```bash
# Update MONGODB_URI in .env
```

5. Seed default categories
```bash
npm run seed
```

6. Start server
```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

Import the Postman collection: `SpendIQ_Postman_Collection.json` into Postman to explore and test the endpoints.
Public documentation: https://documenter.getpostman.com/view/YOUR_WORKSPACE/YOUR_COLLECTION (You can publish this from Postman).

## Environment Variables

See `.env.example` for required variables.

## Project Structure

```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
│   └── app.js
├── server.js
└── package.json
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Expenses
- POST `/api/expenses` - Create expense
- GET `/api/expenses` - Get all expenses (with filters)
- GET `/api/expenses/:id` - Get single expense
- PUT `/api/expenses/:id` - Update expense
- DELETE `/api/expenses/:id` - Delete expense

### Categories
- GET `/api/categories` - Get all categories
- POST `/api/categories` - Create category
- PUT `/api/categories/:id` - Update category
- DELETE `/api/categories/:id` - Delete category

### Dashboard
- GET `/api/dashboard/summary` - Get financial summary
- GET `/api/dashboard/monthly-trend` - Get trend data
- GET `/api/dashboard/budget-status` - Get budget status
- POST `/api/dashboard/budgets` - Create/update budget

### SMS Parsing
- POST `/api/sms/parse` - Parse single SMS
- POST `/api/sms/bulk-parse` - Parse multiple SMS

## License

MIT
