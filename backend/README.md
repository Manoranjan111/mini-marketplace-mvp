# Mini Marketplace MVP Backend

A robust TypeScript-based backend for a mini marketplace, featuring role-based access control (RBAC), Prisma ORM for PostgreSQL, and payload encryption for enhanced security.

---

## **Project File Structure**

```text
backend/
├── dist/                   # Compiled JavaScript files (Production)
├── prisma/                 # Database schema and migrations
│   ├── migrations/         # SQL migration history
│   └── schema.prisma       # Prisma data model definition
├── src/                    # Source code (TypeScript)
│   ├── controllers/        # Business logic for endpoints
│   │   ├── admin/          # Admin-specific logic
│   │   ├── buyer/          # Buyer-specific logic
│   │   ├── seller/         # Seller-specific logic
│   │   └── auth.controller.ts
│   ├── entity/             # Zod validation schemas & types
│   ├── generated/          # Auto-generated Prisma client (TS)
│   ├── lib/                # Shared utilities & service clients
│   │   ├── api-error.ts    # Standard error handler class
│   │   ├── api-response.ts # Standard response wrapper
│   │   ├── prisma.ts       # Prisma client instance
│   │   └── encrypt-payload.ts # AES encryption logic
│   ├── middlewares/        # Express middlewares (Auth, Multer, etc.)
│   ├── routes/             # API route definitions
│   │   ├── admin/
│   │   ├── buyer/
│   │   ├── seller/
│   │   └── auth.routes.ts
│   ├── index.ts            # Application entry point
│   └── types.d.ts          # Global type definitions
├── .env.sample             # Template for environment variables
├── package.json            # Scripts and dependencies
├── prisma.config.ts        # Prisma configuration
├── tsconfig.json           # TypeScript configuration
└── types.d.ts              # Root type definitions
```

---

## **API Usage Documentation**

All endpoints are prefixed with `/api/v1`.  
**Note:** All success responses are wrapped in an `ApiResponse` object. Sensitive data in the `data` field is AES encrypted using the `PAYLOAD_ENCRYPTION_KEY`.

### **Authentication**

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth` | Login user and receive tokens | No |
| `POST` | `/auth/refresh-token` | Refresh expired access token | No |
| `GET` | `/auth` | Get current logged-in user profile | Yes |
| `GET` | `/auth/logout` | Invalidate current session and clear cookies | Yes |
| `DELETE` | `/auth/session` | Remove all active sessions for the user | Yes |
| `DELETE` | `/auth/session/:sessionId` | Remove a specific active session | Yes |

**Login Example:**
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "role": "BUYER"
  }
  ```
- **Response:** Cookies `access_token` and `refresh_token` are set. Data field contains encrypted user profile.

---

### **Buyer Endpoints**

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/buyer/signup` | Register a new buyer account | No |
| `GET` | `/buyer/product` | Search and filter products | No |
| `POST` | `/buyer/order` | Place a new order | Yes (Buyer) |
| `GET` | `/buyer/order` | List all orders placed by the buyer | Yes (Buyer) |

**Place Order Example:**
- **Request Body:**
  ```json
  {
    "productId": "prod_123",
    "quantity": 2
  }
  ```

---

### **Seller Endpoints**

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/seller/product` | Add a new product (with image upload) | Yes (Seller) |
| `GET` | `/seller/product` | List all products owned by the seller | Yes (Seller) |
| `DELETE` | `/seller/product/:id` | Remove a product | Yes (Seller) |
| `GET` | `/seller/order` | List orders for seller's products | Yes (Seller) |
| `GET` | `/seller/dashboard` | Get sales and product statistics | Yes (Seller) |

---

### **Admin Endpoints**

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/dashboard` | System-wide statistics | Yes (Admin) |
| `POST` | `/admin/seller` | Manually register a new seller | Yes (Admin) |
| `PATCH` | `/admin/order/:id` | Update order status (PENDING/APPROVED/etc.) | Yes (Admin) |
| `GET` | `/admin/buyer` | List all registered buyers | Yes (Admin) |
| `GET` | `/admin/seller` | List all registered sellers | Yes (Admin) |

---

## **Deployment & Setup Guide**

### **Prerequisites**
- Node.js (v18+)
- PostgreSQL Database
- Cloudinary Account (for image uploads)

### **Step-by-Step Installation**

1.  **Clone and Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Configuration:**
    Copy `.env.sample` to `.env` and fill in the required values:
    ```bash
    cp .env.sample .env
    ```
    Required Variables:
    - `DATABASE_URL`: Your PostgreSQL connection string.
    - `PAYLOAD_ENCRYPTION_KEY`: A 32-character secret key for AES encryption.
    - `ACCESS_TOKEN_SECRET` / `REFRESH_TOKEN_SECRET`: JWT secrets.
    - `CLOUDINARY_*`: Credentials for asset management.

3.  **Database Migration:**
    Push the schema to your database:
    ```bash
    npx prisma migrate dev --name init
    ```

4.  **Code Generation:**
    Generate the Prisma client to the custom directory:
    ```bash
    npx prisma generate
    ```

5.  **Build Compilation:**
    Compile TypeScript to JavaScript:
    ```bash
    npm run build
    ```

6.  **Launch Application:**
    - **Development Mode** (Hot Reload):
      ```bash
      npm run dev
      ```
    - **Production Mode**:
      ```bash
      npm start
      ```

---

## **Security & Architecture**

- **Authentication**: JWT-based stateless authentication with rotating refresh tokens stored in HTTP-only cookies.
- **RBAC**: Custom middlewares (`isAdmin`, `isSeller`, `isBuyer`) protect routes based on user roles defined in the Prisma schema.
- **Payload Encryption**: All sensitive JSON responses are encrypted using `crypto-js` (AES-256) before transmission.
- **Validation**: Strict schema validation using `Zod` for all incoming request bodies.
- **Rate Limiting**: Integrated `express-rate-limit` to prevent brute-force attacks and DDoS.
