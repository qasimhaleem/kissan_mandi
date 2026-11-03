# KissanMandi (کسان منڈی) - Bidding-Based Agricultural Marketplace

Direct crop bidding platform connecting farmers (sellers) and buyers without commission agents (*arhtis*).

---

## Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, MongoDB with Mongoose, JWT Auth, Multer (Local & Cloudinary uploads), Socket.io
- **Languages**: English and Urdu (with native RTL support and Nastaliq typography)

---

## Setup & Running the App

### 1. Backend (`/server`)
1. Open a terminal and navigate to the server directory:
   ```bash
   cd server
   npm install
   ```
2. Configure your MongoDB Atlas connection string in `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@<your-cluster>.mongodb.net/kissan_mandi?retryWrites=true&w=majority
   JWT_SECRET=kissan_mandi_super_secret_jwt_key_2026
   CLIENT_URL=http://localhost:3000
   ```
3. Start the backend:
   ```bash
   npm start
   # or for development mode:
   npm run dev
   ```
   The backend runs at `http://localhost:5000` with the health check at `http://localhost:5000/api/health`.

---

### 2. Frontend (`/`)
1. From the project root:
   ```bash
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Implemented in Phase 1 & Phase 2
- **Phase 1: Project Setup, MongoDB Schema, Auth & Roles**:
  - Express REST API with Socket.io server.
  - Mongoose models: `User` (with roles: `farmer` and `buyer`, location coordinates), `Listing` (with 2dsphere index), and `Bid`.
  - JWT Authentication: Registration, Login, and `/api/auth/me`.
  - Bilingual Context (`ur` & `en`) with RTL support, default Urdu for farmers, and persistent language switch button.
  - Strict Design System palette:
    - Primary Green: `#8FD19E` (Hover: `#6DBE82`)
    - Cream Background: `#FAF6EA`
    - Clean White: `#FFFFFF`
    - Text: `#2B2B2B`
  - Mobile-first responsiveness and bottom navigation for mobile screens.

- **Phase 2: Farmer Flow**:
  - Extremely simple Farmer Dashboard with max 3 main touch actions:
    1. **Post Produce** (`/farmer/post`):
       - Crop selector with icons (Wheat, Rice, Cotton, Sugarcane, Maize, Potato, Onion, Tomato, Mango, Citrus)
       - Quantity + unit (kg / maund / ton)
       - Minimum base price per unit
       - Location (auto-detect button or district dropdown)
       - Exactly 2 photos required with preview (front view & quality close-up)
       - Auction duration options (6h / 12h / 24h / 2 days)
       - Large action button with clear visual feedback
    2. **My Listings** (`/farmer`): List of all produce posted by the logged-in farmer with active/sold status badges, base prices, and highest bid.
    3. **Bids Received** (`/farmer/bids`): Bids sorted highest first, with a large "Accept" button and direct phone reveal upon acceptance for offline delivery & COD payment.
