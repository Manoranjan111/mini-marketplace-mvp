# Project Setup and Running Guide

This document provides step-by-step instructions for setting up and running the backend and frontend applications of the Mini Marketplace MVP.

---

## **Backend Setup**

The backend is built with Express, TypeScript, and Prisma.

### **1. Navigate to Backend Directory**
Open your terminal and change the directory to the backend folder:
```bash
cd backend
```

### **2. Install Dependencies**
Install the necessary npm packages:
```bash
npm install
```

### **3. Environment Configuration**
Copy the `.env.sample` file to create your `.env` file:
```bash
cp .env.sample .env
```
Open the `.env` file and provide the required values, especially the `DATABASE_URL` for your database connection and `CLOUDINARY` credentials.

### **4. Prisma Database Setup**
Execute the following commands to set up your database schema and generate the Prisma Client:

- **Run Migrations**: This will apply the database schema to your database.
  ```bash
  npx prisma migrate dev
  ```
- **Generate Prisma Client**: This will generate the Prisma Client based on your schema.
  ```bash
  npx prisma generate
  ```

### **5. Build the Application**
Compile the TypeScript code into JavaScript:
```bash
npm run build
```

### **6. Run the Application**

- **Development Mode**: Runs the server with hot-reloading.
  ```bash
  npm run dev
  ```
- **Production Mode**: Runs the compiled JavaScript from the `dist` folder.
  ```bash
  npm run start
  ```
The backend server will typically run on `http://localhost:8000`.

---

## **Frontend Setup**

The frontend consists of three separate Vite-based React applications: **Admin**, **Buyer**, and **Seller**.

### **General Steps for Each Application**
For each application (`admin`, `buyer`, and `seller`), follow these steps:

#### **1. Navigate to the Application Folder**
- **Admin**: `cd frontend/admin`
- **Buyer**: `cd frontend/buyer`
- **Seller**: `cd frontend/seller`

#### **2. Install Dependencies**
```bash
npm install
```

#### **3. Environment Configuration**
Each frontend app requires a `.env` file. Copy the `.env.sample` in each directory:
```bash
cp .env.sample .env
```
Ensure `VITE_API_URL` points to your running backend API (e.g., `http://localhost:8000/api/v1`).

#### **4. Build the Application**
To create a production-ready build:
```bash
npm run build
```

#### **5. Run the Application**
To start the development server:
```bash
npm run dev
```

### **Application URLs (Default)**
- **Admin**: `http://localhost:5173`
- **Buyer**: `http://localhost:5174` (or next available port)
- **Seller**: `http://localhost:5175` (or next available port)

---

## **Summary of Commands**

| Component | Directory | Install | Build | Run (Dev) |
| :--- | :--- | :--- | :--- | :--- |
| **Backend** | `backend/` | `npm install` | `npm run build` | `npm run dev` |
| **Admin** | `frontend/admin/` | `npm install` | `npm run build` | `npm run dev` |
| **Buyer** | `frontend/buyer/` | `npm install` | `npm run build` | `npm run dev` |
| **Seller** | `frontend/seller/` | `npm install` | `npm run build` | `npm run dev` |
