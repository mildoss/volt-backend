# Volt Store Backend

Powerful and scalable REST API for Volt E-commerce platform, built with **NestJS 11**, **Prisma ORM**, and **PostgreSQL**.

## 🚀 Features

- **Authentication & Authorization:** Secure JWT-based authentication with Passport and Role-based access control (Admin/User).
- **Product Management:** Full CRUD operations for products, categories, and inventory management.
- **Order System:** Complete order lifecycle management (Pending -> Shipped -> Delivered).
- **Shopping Cart:** Persistent cart management for users.
- **Reviews & Ratings:** User reviews system for products.
- **Media Handling:** Image uploads and management via Cloudinary.
- **Statistics:** Admin dashboard analytics and reporting.
- **Pagination:** Global pagination support for list endpoints.

## 🛠 Tech Stack

- **Framework:** [NestJS 11](https://nestjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Passport.js](https://www.passportjs.org/) + JWT
- **Validation:** class-validator & class-transformer
- **Media Storage:** Cloudinary

## 📦 Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL database
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd volt-backend

2. Install dependencies:

    npm install

3. Environment Setup: Create a .env file in the root directory:

    DATABASE_URL="your-db"
    JWT_SECRET="your-key"
    CLOUDINARY_CLOUD_NAME="your-cloud-name"
    CLOUDINARY_API_KEY="your-api-key"
    CLOUDINARY_API_SECRET="your-api-secret"

4. Database Setup: Run Prisma migrations to create tables:
    Bash

    npx prisma migrate dev --name init

5. Run the server:

    # Development mode
    npm run start:dev

    # Production mode
    npm run start:prod

The API will be available at http://localhost:3000/
📜 Scripts

    npm run start:dev - Runs the application in watch mode.

    npm run build - Compiles the application.

    npm run lint - Lints the code using ESLint.

    npm run format - Formats code with Prettier.

    npx prisma studio - Opens a GUI to view and edit database data.

📂 Database Schema

The core entities include:

    User: Manages authentication, profiles, and addresses. Roles: USER, ADMIN.

    Product: Stores item details, price, stock, and category relations.

    Order: Tracks purchases with statuses (PENDING, SHIPPED, DELIVERED, CANCELLED).

    Review: Links users to products with ratings and comments.

    Cart: Handles temporary item storage for users.
