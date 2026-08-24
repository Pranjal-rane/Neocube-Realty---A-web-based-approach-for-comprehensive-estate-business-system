# NeoCube Realty — React + Tailwind CSS Frontend

This is the organized frontend for the NeoCube Realty final-year project.

## Technology
- React.js + Vite
- Tailwind CSS
- React Router
- Lucide React icons
- JavaScript
- LocalStorage for frontend-only demo state

## Planned full-stack integration
- Backend: Java + Spring Boot
- Security: Spring Security + JWT
- Database: MySQL
- ORM: Spring Data JPA + Hibernate
- API Testing: Postman
- AI/ML: Python + FastAPI + Scikit-learn
- Image/File Storage: Cloudinary
- Maps: Google Maps API
- Email: Spring Mail / Gmail SMTP
- Version Control: Git + GitHub
- Deployment: AWS
- Frontend Hosting: Vercel
- Backend Hosting: AWS EC2 / Render
- Database Hosting: AWS RDS (MySQL)
- API Documentation: Swagger / OpenAPI

## Run the project
1. Extract the ZIP.
2. Open the `NeoCube_Realty_React_Tailwind` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Run:

```bash
npm install
```

5. Then run:

```bash
npm run dev
```

6. Open the localhost URL shown by Vite.

## Frontend structure

```text
NeoCube_Realty_React_Tailwind
│
├── src
│   ├── assets
│   ├── components
│   ├── data
│   ├── hooks
│   ├── layouts
│   ├── pages
│   │   └── dashboard
│   └── styles
│
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Customer/Public Website
- Home
- Properties
  - Property Listing
  - Search & Filter
  - Property Details
  - Compare Properties
- Favorites
- About Us
- Services
- Developers / Partners
- Contact Us
- Inquiry Form
- Schedule Site Visit
- Login / Registration
- Customer Dashboard
  - Dashboard
  - My Inquiries
  - My Site Visits
  - My Bookings / Deals
  - Favorites

## Frontend demo behavior
- Property search/filter works.
- Property details work.
- Favorites persist in browser LocalStorage.
- Compare supports up to 3 properties.
- Inquiry and site-visit forms save demo records to LocalStorage.
- Login/register create a frontend demo session and open the dashboard.
- These are frontend demo features; real authentication/database/API behavior will be connected to Spring Boot later.

## Important
The provided NeoCube Realty logo and property visual assets are included locally. No external image URL is required for the core UI.
