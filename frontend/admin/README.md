# Mini Marketplace - Admin Panel

A comprehensive administration dashboard for managing the Mini Marketplace platform. Built with React 19, Vite, and Tailwind CSS 4, this application provides administrators with tools to manage products, orders, buyers, sellers, and platform-wide configurations.

---

## 1. Project Structure

The project follows a modular React architecture with a clear separation of concerns between UI components, page views, and API services.

```text
admin/
├── public/                 # Static assets (favicons, etc.)
├── src/                    # Source code
│   ├── assets/             # Images, icons, and SVGs
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Shadcn/UI base components (Button, Card, etc.)
│   │   ├── add-admin.tsx   # Admin creation modal
│   │   ├── add-seller.tsx  # Seller creation modal
│   │   ├── navbar.tsx      # Main navigation sidebar
│   │   └── view-order.tsx  # Order details modal
│   ├── lib/                # Shared utilities
│   │   └── utils.ts        # Tailwind merge & AES decryption helpers
│   ├── pages/              # Main view components (routed)
│   │   ├── home.tsx        # Dashboard overview (Stats)
│   │   ├── products.tsx    # Product inventory management
│   │   ├── orders.tsx      # Order tracking & status updates
│   │   ├── buyer.tsx       # Buyer management
│   │   ├── seller.tsx      # Seller management
│   │   ├── profile.tsx     # Admin profile & session management
│   │   └── login.tsx       # Authentication entry point
│   ├── services/           # API communication layer
│   │   ├── api.ts          # Axios instance & interceptors
│   │   └── index.ts        # API endpoint definitions
│   ├── App.tsx             # Main application component & routing
│   ├── main.tsx            # Application entry point
│   └── App.css             # Global styling
├── .env.sample             # Environment variable template
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

---

## 2. API Documentation

The Admin Panel interacts with a backend API using **Axios**. All data-heavy responses are encrypted using **AES-256** for security.

### **Authentication**

All requests include `withCredentials: true` to support cookie-based sessions.

| Endpoint              | Method   | Description                | Request Body                      |
| :-------------------- | :------- | :------------------------- | :-------------------------------- |
| `/auth`               | `POST`   | User Login                 | `{ "email": "", "password": "" }` |
| `/auth`               | `GET`    | Get Current Admin Profile  | -                                 |
| `/auth/logout`        | `GET`    | Terminate Current Session  | -                                 |
| `/auth/refresh-token` | `GET`    | Refresh Access Token       | -                                 |
| `/auth/session`       | `DELETE` | Logout from All Sessions   | -                                 |
| `/auth/session/:id`   | `DELETE` | Terminate Specific Session | -                                 |

### **Administrative Management**

| Endpoint           | Method  | Description             | Request Body                                          |
| :----------------- | :------ | :---------------------- | :---------------------------------------------------- |
| `/admin/dashboard` | `GET`   | Platform Stats (Totals) | -                                                     |
| `/admin/product`   | `GET`   | List All Products       | -                                                     |
| `/admin/order`     | `GET`   | List All Orders         | -                                                     |
| `/admin/order/:id` | `PATCH` | Update Order Status     | `{ "status": "PENDING/APPROVED/REJECTED/COMPLETED" }` |
| `/admin/buyer`     | `GET`   | List All Buyers         | -                                                     |
| `/admin/seller`    | `GET`   | List All Sellers        | -                                                     |
| `/admin/seller`    | `POST`  | Register New Seller     | `{ "name": "", "email": "", "password": "" }`         |
| `/admin`           | `GET`   | List All Administrators | -                                                     |
| `/admin`           | `POST`  | Register New Admin      | `{ "name": "", "email": "", "password": "" }`         |

### **Encryption & Security**

- **Payload Security**: Sensitive API responses are encrypted. The application uses `CryptoJS` to decrypt data using the `VITE_PAYLOAD_ENCRYPTION_KEY`.
- **Interceptors**: An automated Axios interceptor handles `401 Unauthorized` errors by attempting a transparent token refresh.

---

## 3. Installation & Setup

### **Prerequisites**

- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm, yarn, or pnpm

### **Step 1: Environment Setup**

Create a `.env` file in the root directory based on `.env.sample`:

```bash
VITE_API_URL=http://localhost:5000/api
VITE_PAYLOAD_ENCRYPTION_KEY=your-secure-decryption-key
```

### **Step 2: Install Dependencies**

```bash
npm install
```

### **Step 3: Development Server**

Start the local development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### **Step 4: Production Build**

To create an optimized production build:

```bash
npm run build
```

The output will be generated in the `dist/` directory.

### **Step 5: Deployment**

The `dist` folder can be served using any static web server (e.g., Nginx, Vercel, Netlify).

```bash
# Preview the production build locally
npm run preview
```

---

## 4. Troubleshooting

| Issue                             | Likely Cause                             | Solution                                                |
| :-------------------------------- | :--------------------------------------- | :------------------------------------------------------ |
| **Login fails with 401**          | Invalid credentials or expired session   | Check credentials; clear browser cookies.               |
| **Data shows "Decryption Error"** | Mismatched `VITE_PAYLOAD_ENCRYPTION_KEY` | Ensure the key in `.env` matches the Backend key.       |
| **API requests timeout**          | Backend server is down or unreachable    | Verify `VITE_API_URL` is correct and server is running. |
| **Styling issues**                | Tailwind CSS JIT compiler lag            | Restart the dev server (`npm run dev`).                 |
