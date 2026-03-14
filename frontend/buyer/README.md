# Mini-Marketplace Buyer Frontend

This is the buyer-facing frontend for the Mini-Marketplace MVP, built with React, Vite, and Tailwind CSS. It provides a seamless shopping experience for users to browse products, manage their cart, and place orders.

## **File Structure**

- **public/**: Contains static assets that are served directly.
- **src/**: Main source code of the application.
  - **assets/**: Image and SVG assets used throughout the app.
  - **components/**: Reusable React components.
    - **ui/**: Core UI components (buttons, inputs, cards) powered by Shadcn UI.
    - **loading-animation.tsx**: Global loading spinner.
    - **navbar.tsx**: Application navigation bar.
  - **lib/**: Utility functions and shared logic.
    - **utils.ts**: Tailwind merge utility and payload decryption logic.
  - **pages/**: Main page components corresponding to routes.
    - **home.tsx**: Product browsing and filtering.
    - **cart.tsx**: Cart management and checkout.
    - **login.tsx / signup.tsx**: Authentication pages.
    - **profile.tsx**: User profile and order history.
  - **services/**: API client and service functions.
    - **api.ts**: Axios instance with interceptors for auth and refresh token logic.
    - **index.ts**: Centralized API endpoint functions.
  - **App.tsx**: Main application entry point and routing configuration.
  - **main.tsx**: React application bootstrap.

## **API Documentation**

The application communicates with a backend API using `axios`. All responses from the backend are expected to be AES-encrypted and are decrypted on the client side.

### **Authentication**

Authentication is handled via HTTP-only cookies (`refresh_token`). The application uses an Axios interceptor to automatically refresh access tokens when a `401 Unauthorized` error occurs.

### **Endpoints**

| Method   | Endpoint            | Description               | Request Body / Params                   |
| :------- | :------------------ | :------------------------ | :-------------------------------------- |
| `POST`   | `/buyer/signup`     | Register a new buyer      | `{ name, email, password }`             |
| `POST`   | `/auth`             | Log in user               | `{ email, password }`                   |
| `GET`    | `/auth`             | Get current user profile  | None                                    |
| `GET`    | `/auth/logout`      | Log out user              | None                                    |
| `GET`    | `/buyer/product`    | List products             | `{ search, niche, minPrice, maxPrice }` |
| `POST`   | `/buyer/order`      | Place a new order         | `{ items: [{ productId, quantity }] }`  |
| `GET`    | `/buyer/order`      | Fetch order history       | None                                    |
| `DELETE` | `/auth/session/:id` | Remove a specific session | `sessionId`                             |
| `DELETE` | `/auth/session`     | Remove all sessions       | None                                    |

### **Example API Usage**

```typescript
import { getProducts } from "@/services";

const fetchProducts = async () => {
  const response = await getProducts({
    search: "fitness",
    niche: "Fitness",
    minPrice: 0,
    maxPrice: 1000,
  });
  if (response.success) {
    // Note: Payload is decrypted automatically in the service
    console.log(response.data);
  }
};
```

## **Application Pages**

- **Home Page (`/`)**:
  - Displays a grid of available products.
  - Includes search and filtering by niche and price range.
  - Users can add items to their local cart.
- **Login Page (`/login`)**:
  - Secure login for existing users.
  - Redirects to the home page or a specified return URL upon success.
- **Signup Page (`/signup`)**:
  - Registration form for new buyers.
- **Cart Page (`/cart`)**:
  - View items added to the cart (stored in `localStorage`).
  - Update quantities or remove items.
  - Place orders (requires authentication).
- **Profile Page (`/profile`)**:
  - Displays user account information.
  - Shows order history and active sessions.
  - Allows managing sessions and logging out.

## **Getting Started**

### **Prerequisites**

- **Node.js**: v18 or higher
- **npm**: v9 or higher

### **Environment Setup**

1. Copy the sample environment file:
   ```bash
   cp .env.sample .env
   ```
2. Configure the following variables in `.env`:
   - `VITE_API_URL`: The base URL of your backend API.
   - `VITE_PAYLOAD_ENCRYPTION_KEY`: The secret key used for decrypting backend responses.

### **Installation**

Install project dependencies using npm:

```bash
npm install
```

### **Running in Development**

Start the development server with hot-module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### **Production Build**

1. Build the application for production:
   ```bash
   npm run build
   ```
2. Preview the production build locally:
   ```bash
   npm run preview
   ```
