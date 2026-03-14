# Mini Marketplace MVP - Seller Frontend

A comprehensive dashboard for sellers to manage products, orders, and their profile in the Mini Marketplace ecosystem. This application is built with React 19, Vite, and TypeScript.

---

## **Table of Contents**

1. [File Structure](#file-structure)
2. [API Usage](#api-usage)
3. [Installation & Running Guide](#installation--running-guide)
4. [Troubleshooting](#troubleshooting)

---

## **File Structure**

```text
frontend/seller/
├── public/                 # Static assets (favicons, etc.)
├── src/
│   ├── assets/             # Images and global style files
│   ├── components/         # Reusable React components
│   │   ├── ui/             # Shadcn UI base components (Button, Card, etc.)
│   │   ├── add-product.tsx # Component for adding new products
│   │   ├── navbar.tsx      # Main navigation component
│   │   └── ...             # Other functional components
│   ├── lib/                # Utility functions
│   │   └── utils.ts        # Tailwind class merging and decryption logic
│   ├── pages/              # Page-level components (Routes)
│   │   ├── home.tsx        # Dashboard home with statistics
│   │   ├── login.tsx       # Authentication page
│   │   ├── orders.tsx      # Order management page
│   │   ├── products.tsx    # Product inventory management
│   │   └── profile.tsx     # User profile and session management
│   ├── services/           # API communication layer
│   │   ├── api.ts          # Axios instance with interceptors for token refresh
│   │   └── index.ts        # API service functions for endpoints
│   ├── App.tsx             # Main application component & routing
│   └── main.tsx            # Application entry point
├── .env                    # Environment variables (API URL, keys)
├── package.json            # Project dependencies and scripts
└── vite.config.ts          # Vite configuration
```

---

## **API Usage**

The application communicates with a backend API using `axios`. All requests are handled via a centralized instance in `src/services/api.ts` which manages authentication and payload decryption.

### **Authentication**

- **Method**: Cookie-based (HttpOnly `refresh_token`) and Header-based (`access_token`).
- **Authorization**: `Bearer <access_token>` in the `Authorization` header.
- **Token Refresh**: Automatically handled by axios interceptors when a 401 error occurs.

### **Available Endpoints**

#### **1. Authentication**

- **Login**
  - **Endpoint**: `POST /auth`
  - **Payload**: `{ "email": "seller@example.com", "password": "password", "role": "seller" }`
  - **Usage**: [services/index.ts](file:///c:/code/test/mini-marketplace-mvp/frontend/seller/src/services/index.ts)

- **Logout**
  - **Endpoint**: `GET /auth/logout`
  - **Usage**: Clears session cookies on the backend.

- **Current User**
  - **Endpoint**: `GET /auth`
  - **Response**: User profile data.

#### **2. Seller Dashboard**

- **Dashboard Data**
  - **Endpoint**: `GET /seller/dashboard`
  - **Response**: Sales statistics and summary data.

#### **3. Product Management**

- **Get All Products**
  - **Endpoint**: `GET /seller/product`
  - **Response**: Array of product objects.

- **Add Product**
  - **Endpoint**: `POST /seller/product`
  - **Format**: `multipart/form-data` (includes image file and product details).
  - **Usage**: [add-product.tsx](file:///c:/code/test/mini-marketplace-mvp/frontend/seller/src/components/add-product.tsx)

- **Delete Product**
  - **Endpoint**: `DELETE /seller/product/:productId`

#### **4. Order Management**

- **Get All Orders**
  - **Endpoint**: `GET /seller/order`

- **Get Order Details**
  - **Endpoint**: `GET /seller/order/:orderId`

---

## **Installation & Running Guide**

### **Prerequisites**

- **Node.js**: v18.0.0 or higher.
- **npm**: v9.0.0 or higher.

### **1. Dependency Installation**

Clone the repository and install the required packages:

```bash
npm install
```

### **2. Environment Configuration**

Create a `.env` file in the root directory (referencing `.env.example` if available):

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_PAYLOAD_ENCRYPTION_KEY=your-secret-key-here
```

### **3. Execution Instructions**

#### **Development Environment**

Starts the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

#### **Staging / Production Build**

Build the application for production:

```bash
npm run build
```

This creates a `dist/` folder containing the optimized static assets.

#### **Production Preview**

Preview the production build locally:

```bash
npm run preview
```

---

## **Troubleshooting**

### **Common Issues**

1. **401 Unauthorized / Token Expiry**
   - **Symptoms**: User is redirected to login or requests fail with 401.
   - **Fix**: The application automatically tries to refresh tokens. If this fails, clear your browser cookies and log in again.

2. **Decryption Failed**
   - **Symptoms**: Error message "Decryption failed" in console.
   - **Fix**: Ensure your `VITE_PAYLOAD_ENCRYPTION_KEY` matches the backend encryption key exactly.

3. **Images Not Uploading**
   - **Symptoms**: Product creation fails when an image is attached.
   - **Fix**: Check that the `VITE_API_URL` is correct and the backend supports `multipart/form-data` requests.

4. **Styling Issues (Tailwind)**
   - **Symptoms**: Components look unstyled.
   - **Fix**: Ensure `npm install` was successful and the Tailwind Vite plugin is active in `vite.config.ts`.
