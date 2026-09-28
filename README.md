# 🛒 MERN E-Commerce Platform

A full-stack e-commerce application built with the **MERN stack**. Sellers can list and manage their own products, and shoppers can browse a responsive storefront. Access is protected with **JWT authentication**, and product images are stored and delivered through **ImageKit**.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)
![Node](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/API-Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)

<!-- Add a screenshot or GIF of your app here. It is the single biggest README upgrade. -->
<!-- ![App preview](./docs/preview.png) -->

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Authentication Flow](#-authentication-flow)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

---

## 📖 Overview

This project is a complete e-commerce platform with a decoupled architecture: a **React** single-page frontend talks to a **Node.js/Express** REST API, which stores data in **MongoDB**.

It demonstrates practical full-stack skills:

- Secure, token-based authentication
- Ownership-based authorization (sellers can only modify their own products)
- Third-party media handling with ImageKit
- A responsive, mobile-friendly UI

---

## ✨ Features

**Authentication & Authorization**
- User registration and login with **JWT**
- Passwords hashed before storage <!-- VERIFY: bcrypt / bcryptjs -->
- Protected routes on both the API and the frontend
- **Seller-protected product CRUD**: only authenticated sellers can create, edit, or delete products

**Product Management**
- Create, read, update, and delete products
- Image upload through **ImageKit** (the image is stored on ImageKit's CDN and its URL is saved in MongoDB)
- Product listing and detail pages

**User Experience**
- Fully responsive, modern UI that works on mobile, tablet, and desktop
- Clean separation between the public storefront and seller-only actions

<!-- VERIFY: add or remove items below based on what is implemented -->
- Shopping cart
- Search and filtering
- Order placement / checkout

---

## 🧰 Tech Stack

| Layer          | Technology                                   |
| -------------- | -------------------------------------------- |
| Frontend       | React, React Router <!-- VERIFY: Vite/CRA, Redux/Context, CSS framework --> |
| Backend        | Node.js, Express.js                          |
| Database       | MongoDB with Mongoose <!-- VERIFY: Mongoose --> |
| Auth           | JSON Web Tokens (JWT)                        |
| Image Storage  | ImageKit                                     |
| File Handling  | Multer <!-- VERIFY --> |

---

## 📂 Project Structure

```
FullStack-Project-E-commerce/
├── Backend/          # Express REST API
│   ├── ...           # models, routes, controllers, middleware, config
│   └── package.json
├── Frontend/         # React client application
│   ├── ...           # components, pages, context/store, services
│   └── package.json
└── README.md
```

<!-- Replace the "..." lines with your real folders once you confirm them, e.g.
Backend: models/, routes/, controllers/, middleware/, config/
Frontend: src/components/, src/pages/, src/context/ -->

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) (local instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- An [ImageKit](https://imagekit.io/) account (the free tier is enough)

### 1. Clone the repository

```bash
git clone https://github.com/Vinay-Maurya-999/FullStack-Project-E-commerce.git
cd FullStack-Project-E-commerce
```

### 2. Set up the backend

```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/` (see [Environment Variables](#-environment-variables)), then start the server:

```bash
npm run dev      # <!-- VERIFY: script name (dev / start) -->
```

The API runs at `http://localhost:5000` <!-- VERIFY: port -->.

### 3. Set up the frontend

Open a second terminal:

```bash
cd Frontend
npm install
npm run dev      # <!-- VERIFY: dev (Vite) or start (CRA) -->
```

The app runs at `http://localhost:5173` <!-- VERIFY: 5173 for Vite, 3000 for CRA -->.

---

## 🔐 Environment Variables

Create `Backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

<!-- VERIFY: match these names exactly to what your code reads from process.env -->

If the frontend needs an API URL, create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000   # <!-- VERIFY: variable name/prefix -->
```

> ⚠️ **Never commit `.env` files.** Make sure `.env` is listed in `.gitignore`, and commit a `.env.example` with placeholder values instead.

---

## 📡 API Reference

<!-- VERIFY: replace with your real routes. This is the typical shape for this kind of app. -->

**Auth**

| Method | Endpoint             | Description          | Access |
| ------ | -------------------- | -------------------- | ------ |
| POST   | `/api/auth/register` | Create a new account | Public |
| POST   | `/api/auth/login`    | Log in, receive JWT  | Public |

**Products**

| Method | Endpoint            | Description                       | Access         |
| ------ | ------------------- | --------------------------------- | -------------- |
| GET    | `/api/products`     | List all products                 | Public         |
| GET    | `/api/products/:id` | Get a single product              | Public         |
| POST   | `/api/products`     | Create a product (with image)     | Seller (JWT)   |
| PUT    | `/api/products/:id` | Update a product                  | Owner (JWT)    |
| DELETE | `/api/products/:id` | Delete a product                  | Owner (JWT)    |

Protected routes expect this header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔄 Authentication Flow

1. The user registers or logs in, and the server returns a signed **JWT**.
2. The client stores the token and sends it in the `Authorization` header on protected requests.
3. Auth middleware verifies the token and attaches the user to the request.
4. For update and delete actions, the server also checks that the logged-in user **owns** the product before allowing the change.

---

## 🗺️ Roadmap

- [ ] Payment gateway integration (Stripe / Razorpay)
- [ ] Order history and seller dashboard
- [ ] Product reviews and ratings
- [ ] Pagination, sorting, and advanced filters
- [ ] Admin role and moderation tools
- [ ] Automated tests (Jest / Supertest)
- [ ] Deployment (Render / Vercel) with a live demo link

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👤 Author

**Vinay Maurya**
GitHub: [@Vinay-Maurya-999](https://github.com/Vinay-Maurya-999)

If you found this project useful, consider giving it a ⭐

---

## 📄 License

This project is licensed under the MIT License. <!-- VERIFY: add a LICENSE file to the repo -->
