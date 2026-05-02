# 🚀 SpendIQ – AI-Powered Expense Tracker

> A privacy-first web app that transforms scattered financial data into clear insights, budgets, and smarter spending decisions.

## 🔗 Quick Links
* **🎨 Figma Design:** [View Figma](https://www.figma.com/design/6RNPZiKmftmzds1lE6YfvV/Untitled?node-id=57-68&t=zb0WoftbEUdwGyeZ-1)
* **🌐 Live Project:** [View Live Site](https://spend-iq-mocha.vercel.app/)
* **📖 API Documentation:** [View Postman Docs](https://documenter.getpostman.com/view/54114750/2sBXqKnzVq)
* **⚙️ Backend Deployment:** [View Backend](https://spendiq-2.onrender.com/)
* **🎥 Demo Video:** [Watch on YouTube](https://youtu.be/inq6ND00ly0)

---
---

## 📌 Problem Statement

Individuals lose control over their spending because transactions are scattered across multiple platforms like:
* UPI apps
* Credit/Debit cards
* Wallets
* Subscriptions

There is no single, simple, unified view of everyday expenses in plain language.

## 💡 Solution

SpendIQ solves this problem by:
* Collecting expense data from multiple sources.
* Organizing it automatically.
* Providing visual insights and AI-driven suggestions.

> 👉 **In short:** “Collect → Understand → Organize → Analyze → Guide”

---

## ✨ Features

### 🤖 AI Financial Assistant
* **Chat-based interface:** Ask questions directly.
    * *“Where did I spend most this month?”*
    * *“How can I save more?”*
* **Smart insights:** Overspending detection and personalized saving tips.

### 📊 Expense Intelligence Dashboard
* Category-wise expense breakdown.
* Monthly & weekly trends.
* Visual charts (pie + graphs) and top spending categories.

### 💸 Smart Budgeting System
* Set category-wise budgets with visual progress bars.
* Alerts when nearing limits.
* AI-based budget suggestions.

### 🔁 Subscription Management
* Auto-detect subscriptions via SMS.
* Renewal reminders and monthly subscription cost tracking.
* Detect unused subscriptions.

### 📩 SMS-Based Expense Tracking
* Automatically reads transaction SMS.
* Extracts **Amount**, **Merchant**, and **Date**.
* Supports UPI, Credit cards, and Wallets.

### 💵 Cash Expense Tracking
* Manual expense entry with a quick add interface.
* Voice input support (optional).

### 💳 Credit Card Tracking
* Track spending via SMS.
* Outstanding amount and due date reminders.
* Credit utilization tracking.

### 📂 Bank Statement Upload
* Upload PDF/CSV statements.
* Auto-parse transactions and merge with existing data.

### 🧾 Receipt Scanner (OCR)
* Upload bill images.
* Extract **Amount**, **Merchant**, and **Date**, and automatically add to expenses.

### 🔔 Smart Alerts & Notifications
* Overspending alerts and bill reminders.
* Unusual transaction detection and savings suggestions.

### 🔐 Privacy-First Design
* No bank login required.
* SMS-based tracking with a local data storage option.
* Encrypted data handling.

---

## 🧠 How It Works

1.  **Data Collection:** Input via SMS, manual entry, file upload, or receipt scanning.
2.  **Data Processing:** Extract key information using Regex and NLP.
3.  **Categorization:** Automatically assign categories (e.g., Food, Travel, Bills).
4.  **Visualization:** Display data in dashboards and interactive charts.
5.  **AI Analysis:** Generate insights and recommendations.

---

## 🏗️ Tech Stack (Suggested)

* **Frontend:** React.js / Next.js, Tailwind CSS, Chart libraries (Chart.js / Recharts)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **AI / Processing:** OpenAI API (for insights), NLP + rule-based parsing
* **OCR:** Tesseract / OCR APIs

---

## 🧩 System Architecture

```text
User Input (SMS / Upload / Manual)
        ↓
Data Extraction Layer (Regex + NLP)
        ↓
Categorization Engine
        ↓
Database (MongoDB)
        ↓
AI Engine (Insights & Suggestions)
        ↓
Frontend Dashboard (React)
```
---
## Frontend Folder Structure

```text
client/
│
├── public/                         # Static files
│   ├── favicon.ico
│   └── index.html
│
├── src/
│   ├── assets/                     # All static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── illustrations/          # SVGs (your onboarding style)
│   │
│   ├── components/                 # Reusable components
│   │   ├── common/                 # Buttons, Inputs, Cards
│   │   ├── layout/                 # Navbar, Sidebar, Footer
│   │   ├── charts/                 # Graphs (Pie, Bar)
│   │   └── ui/                     # Modals, Dropdowns
│   │
│   ├── pages/                      # Page-level components
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   │
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── Expenses/
│   │   │   └── Expenses.jsx
│   │   │
│   │   ├── AI/
│   │   │   └── Assistant.jsx
│   │   │
│   │   ├── Budget/
│   │   │   └── Budget.jsx
│   │   │
│   │   ├── Subscription/
│   │   │   └── Subscription.jsx
│   │   │
│   │   ├── CreditCard/
│   │   │   └── CreditCard.jsx
│   │   │
│   │   ├── AddExpense/
│   │   │   └── AddExpense.jsx
│   │   │
│   │   ├── ReceiptScanner/
│   │   │   └── ReceiptScanner.jsx
│   │   │
│   │   └── Settings/
│   │       └── Settings.jsx
│   │
│   ├── routes/                     # App routing
│   │   └── AppRoutes.jsx
│   │
│   ├── services/                   # API calls
│   │   ├── api.js                  # Axios config
│   │   ├── authService.js
│   │   ├── expenseService.js
│   │   ├── budgetService.js
│   │   ├── subscriptionService.js
│   │   ├── creditService.js
│   │   └── aiService.js
│   │
│   ├── context/                    # Global state
│   │   ├── AuthContext.js
│   │   └── ExpenseContext.js
│   │
│   ├── hooks/                      # Custom hooks
│   │   ├── useAuth.js
│   │   └── useExpenses.js
│   │
│   ├── utils/                      # Helper functions
│   │   ├── formatCurrency.js
│   │   ├── categoryMapper.js
│   │   ├── dateUtils.js
│   │   └── constants.js
│   │
│   ├── styles/                     # Global styles
│   │   └── index.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── package.json
└── vite.config.js / next.config.js
```
---
## Backend Folder Structure

```text
server/
│
├── src/
│   ├── config/                     # Configuration
│   │   ├── db.js
│   │   └── env.js
│   │
│   ├── controllers/                # Request handlers
│   │   ├── auth.controller.js
│   │   ├── expense.controller.js
│   │   ├── budget.controller.js
│   │   ├── subscription.controller.js
│   │   ├── credit.controller.js
│   │   └── ai.controller.js
│   │
│   ├── routes/                     # API routes
│   │   ├── auth.routes.js
│   │   ├── expense.routes.js
│   │   ├── budget.routes.js
│   │   ├── subscription.routes.js
│   │   ├── credit.routes.js
│   │   └── ai.routes.js
│   │
│   ├── models/                     # MongoDB schemas
│   │   ├── User.js
│   │   ├── Expense.js
│   │   ├── Budget.js
│   │   ├── Subscription.js
│   │   └── CreditCard.js
│   │
│   ├── services/                   # Core logic
│   │   ├── smsParser.service.js
│   │   ├── categorization.service.js
│   │   ├── ai.service.js
│   │   ├── ocr.service.js
│   │   └── credit.service.js
│   │
│   ├── middlewares/                # Middleware
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validator.middleware.js
│   │
│   ├── utils/                      # Utilities
│   │   ├── regexPatterns.js        # SMS parsing rules
│   │   ├── logger.js
│   │   └── helpers.js
│   │
│   ├── jobs/                       # Background tasks
│   │   ├── subscriptionReminder.job.js
│   │   ├── alert.job.js
│   │   └── cron.js
│   │
│   ├── app.js                      # Express app setup
│   └── server.js                   # Entry point
│
├── .env
├── package.json
└── README.md
