# Finlyt – Personal Expense Tracking Platform

Finlyt is a modern, full-stack expense tracker application built with the MERN stack (MongoDB, Express, React, Node.js). It empowers users to manage accounts, budgets, categories, and transactions, with advanced analytics and secure authentication.

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [How to Fork This Project](#how-to-fork-this-project)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User authentication (JWT, cookies)
- Add, edit, and delete accounts, budgets, categories, and transactions
- Real-time analytics and category breakdowns
- Responsive design for mobile and desktop
- Secure backend with protected routes
- Modern UI/UX with Vite and Tailwind CSS

---

## Demo

- **Live Demo:** [https://finlyt-web.vercel.app](https://finlyt-web.vercel.app)
- **API:** [https://finlyt-api.onrender.com](https://finlyt-api.onrender.com)

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT, Cookies

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/venkata-arjun/expense-tracker-mern.git
   cd expense-tracker-mern
   ```
2. **Install dependencies:**
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` in both `backend` and `frontend` folders.
   - Fill in required values (see [Environment Variables](#environment-variables)).
4. **Run the backend:**
   ```bash
   cd backend
   npm start
   ```
5. **Run the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
6. **Access the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:5000/api](http://localhost:5000/api)

---

## Project Structure

```
expense-tracker-mern/
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
└── README.md
```

---

## Environment Variables

### Backend (`backend/.env`)

- `PORT=5000`
- `MONGO_URI=<your-mongodb-uri>`
- `CLIENT_URL=<your-frontend-url>`
- `JWT_SECRET=<your-jwt-secret>`
- `NODE_ENV=development|production`

### Frontend (`frontend/.env`)

- `VITE_API_URL=<your-backend-api-url>`
- `VITE_HERO_IMAGE_URL=<hero-image-url>`
- `VITE_FEATURE1_IMAGE_URL=<feature-image-url>`
- ...

---

## How to Fork This Project

1. **Sign in to GitHub.**
2. **Navigate to the repository:** [https://github.com/venkata-arjun/expense-tracker-mern](https://github.com/venkata-arjun/expense-tracker-mern)
3. **Click the "Fork" button** at the top right.
4. **Clone your forked repository:**
   ```bash
   git clone https://github.com/<your-username>/expense-tracker-mern.git
   ```
5. **Follow the [Getting Started](#getting-started) steps** to set up locally.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Commit your changes with clear messages.
4. Push to your fork and open a Pull Request.
5. Ensure your code follows the project style and passes all tests.

---

## License

This project is licensed under the MIT License.

---

## Contact

- **Author:** Venkata Arjun
- **GitHub:** [venkata-arjun](https://github.com/venkata-arjun)
- **Live App:** [https://finlyt-web.vercel.app](https://finlyt-web.vercel.app)

---

Finlyt — Take control of your finances today!
