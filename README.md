# Al Zaban Hardware Store — Full-Stack E-Commerce Platform

A complete, production-ready, full-stack e-commerce web platform for **Al Zaban Hardware Store**, a premier hardware, tools, building and industrial supplies merchant based in Township, Lahore, Pakistan.

---

## 🏬 Business Information
- **Business Name:** Al Zaban Hardware Store
- **Category:** Hardware Store / Tools / Building & Industrial Supplies
- **Address:** Plot #3, Sector B-1, Block 11, Township, Lahore 54770, Pakistan
- **Phone:** +92 42 35110830
- **WhatsApp:** +92 335 1108300
- **Email:** [info@alzaban.com](mailto:info@alzaban.com)
- **Website:** [https://www.alzaban.com/](https://www.alzaban.com/)
- **Store Hours:** Monday – Saturday: 9:00 AM – 8:00 PM | Sunday: Closed (Online Orders Active)
- **Currency:** Pakistani Rupee (`PKR` / `Rs.`)

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS with Industrial Charcoal (`#1F2937`) and Industrial Amber (`#F59E0B`) theme
- **Routing:** React Router DOM v6
- **Icons:** Lucide React
- **State Management:** React Context API (`AuthContext`, `CartContext`, `WishlistContext`, `ToastContext`)
- **HTTP Client:** Axios (with automated JWT Bearer authorization interceptor)

### Backend
- **Runtime:** Node.js & Express.js
- **Database:** MongoDB & Mongoose schemas (`User`, `Product`, `Category`, `Order`, `Cart`, `Review`, `Coupon`, `Wishlist`)
- **Resilience Engine:** Seamless fallback to embedded persistent storage (`backend/data/store.json`) with auto-population of 145 hardware products if no standalone MongoDB instance is running locally.
- **Authentication:** JWT tokens (`jsonwebtoken`) & password hashing (`bcryptjs`)
- **Logging & Security:** Morgan, CORS, input sanitization

---

## 🚀 Quick Start Guide

### 1. Installation
Install all dependencies for root, backend, and frontend:
```bash
npm run install:all
```
*(Or navigate to `backend/` and `frontend/` separately and run `npm install`)*

### 2. Database Seeding
To populate or re-seed the 145 realistic hardware products, categories, sample orders, and demo accounts:
```bash
npm run seed
```

### 3. Launch Development Servers
Run both backend and frontend concurrently:
```bash
npm run dev
```
- **Storefront (Frontend):** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`
- **API Health Check:** `http://localhost:5000/api/health`

---

## 🔐 Demo Accounts & Authentication

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@alzaban.com` | `Admin@Alzaban2026` | Full Admin Dashboard, Inventory CRUD, Orders, Categories, Users |
| **Customer** | `customer@alzaban.com` | `Customer@12345` | Storefront, Wishlist, Cart, Checkout, Order Tracking |

*Quick login buttons are also provided directly on the Login page for one-click testing.*

---

## 📦 Product Catalog (145 Products across 12 Departments)

1. **Hand Tools:** Stanley claw hammers, combination pliers, adjustable wrenches, screwdriver sets, pipe wrenches, hex keys, locking pliers (Stanley, Ingco, Total).
2. **Power Tools:** Ingco 650W impact drills, SDS Plus rotary hammers, Bosch angle grinders, Makita electric drills, Dewalt 20V brushless cordless drills, jigsaws, circular saws.
3. **Measuring Tools:** Stanley 5m & 7.5m measuring tapes, aluminum spirit levels, Ingco laser distance meters, stainless steel vernier calipers, engineer rulers, carpenter speed squares.
4. **Fasteners:** Grade 8.8 hex bolts, 304 stainless steel screws, drywall screws, rawl plugs, Fischer wall plugs, hex nuts, spring washers, concrete wedge anchor bolts.
5. **Plumbing Supplies:** uPVC elbows, tees, couplers, unions, Master Pipe fittings, brass ball valves, PTFE teflon tape, ratcheting pipe cutters, flexible water connectors.
6. **Electrical Supplies:** PVC insulation tape, heavy cable ties, electrical conduit, circuit breakers (Schneider Electric), digital multimeters, automatic wire strippers, extension cables.
7. **Paint & Accessories:** Pure bristle paint brushes (1", 2", 4"), 9" microfiber rollers, putty knives, scrapers, sandpapers, masking tape, telescopic roller poles.
8. **Safety Equipment:** ANSI-certified industrial safety helmets, heavy cowhide leather gloves, clear goggles, dust masks, noise-cancelling ear muffs, high-vis vests, steel toe shoes.
9. **Adhesives & Sealants:** Clear & white silicone sealants, epoxy steel 4-minute weld, PVC solvent cement, instant cyanoacrylate glue with activator spray, expanding foam.
10. **Cutting Tools:** Bi-metal hacksaw frames, heavy utility knives, bi-metal hole saw kits, Bosch jigsaw blades, metal cutting abrasive discs, segmented diamond masonry discs.
11. **Building Hardware:** SUS304 ball-bearing door hinges, solid brass mortise locksets, stainless steel tower bolts, monoblock padlocks, soft-close drawer runners.
12. **Workshop Accessories:** Cantilever steel toolboxes, 6-inch swivel bench vises, magnetic parts bowls, leather contractor tool belts, hardware storage drawer bins.

---

## 💬 WhatsApp Integration (+92 335 1108300)
- **Product Page ("Ask on WhatsApp"):** Pre-fills message:
  `Hello Al Zaban Hardware Store, I am interested in [PRODUCT NAME]. Please provide availability and current price.`
- **Cart Page ("Order Inquiry via WhatsApp"):** Generates itemized order breakdown with quantities and estimated subtotal for immediate WhatsApp confirmation.
- **Floating Button:** Global floating action button for instant chat with the Lahore store.

---

## 🏛️ Admin Management Portal (`/admin`)
- **Dashboard (`/admin` or `/admin/dashboard`):** Real-time revenue analytics, pending vs completed order metrics, low stock alerts, monthly sales bar chart, and category performance.
- **Product Inventory (`/admin/products`):** Create, update, delete products, modify stock quantities, price adjustments, discount percentages, and mark featured/bestseller badges.
- **Order Management (`/admin/orders`):** Filter by status (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), view order items and customer notes, update statuses, and directly message customers via WhatsApp.
- **Category Control (`/admin/categories`):** Add, edit, or remove departments and customize header images.
- **User Directory (`/admin/users`):** View registered buyers and administrators.

---

## 🌐 SEO & Responsive Specifications
- Fully responsive across Mobile (375px), Tablet (768px), and Desktop (1280px+).
- Dynamic metadata, OpenGraph tags, semantic HTML5, `robots.txt`, and XML `sitemap.xml`.
- Zero broken links, zero placeholder text, and genuine Lahore business details throughout.
