# TutorLink Task Checklist

## Phase 1: Foundation & Authentication Setup (Backend)
- `[x]` Initialize Node.js backend project (`server/package.json`)
- `[x]` Install backend dependencies (`express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`, `nodemon`)
- `[x]` Set up environmental variables (`server/.env`) and MongoDB configuration (`server/config/db.js`)
- `[x]` Create Mongoose models:
  - `[x]` User model (`server/models/User.js`)
  - `[x]` TutorProfile model (`server/models/TutorProfile.js`)
  - `[x]` StudentProfile model (`server/models/StudentProfile.js`)
- `[x]` Create Auth middleware (`server/middleware/authMiddleware.js`)
- `[x]` Create Auth controller (`server/controllers/authController.js`)
- `[x]` Create Auth routes (`server/routes/authRoutes.js`)
- `[x]` Assemble entry point file (`server/server.js`)
- `[ ]` Test user registration and login endpoints via basic HTTP requests (Blocked: Requires MongoDB service to be active or Atlas URI in .env)

## Phase 2: Core MVC API Development
- `[x]` Create TuitionRequest model (`server/models/TuitionRequest.js`)
- `[x]` Create Review model (`server/models/Review.js`)
- `[x]` Create Notification model (`server/models/Notification.js`)
- `[x]` Develop Profile controllers and routes
- `[x]` Develop TuitionRequest controllers and routes
- `[x]` Develop Review controllers and routes
- `[x]` Implement static file upload configuration for certificates

## Phase 3: Algorithms & Recommendation Engine
- `[x]` Implement `server/algorithms/Haversine.js`
- `[x]` Implement `server/algorithms/KMeans.js`
- `[x]` Implement `server/algorithms/RecommendationEngine.js`
- `[x]` Connect recommendation algorithms to API endpoints (`server/routes/recommendationRoutes.js`)

## Phase 4: Frontend Development
- `[ ]` Initialize Vite React App with Tailwind CSS in `client/`
- `[ ]` Set up routing and context providers (Authentication, Notifications)
- `[ ]` Build layouts and common components (Navbar, Sidebar, MapView)
- `[ ]` Build authentication screens (Login/Register for Tutors and Students)
- `[ ]` Build Student Dashboard, Tutor Search, and recommendation view
- `[ ]` Build Tutor Dashboard (Profile update, availability scheduler, requests manager)
- `[ ]` Build Admin Dashboard (Verify tutors, system stats)

## Phase 5: Verification & Walkthrough
- `[ ]` Write integration tests for the recommendation engine
- `[ ]` Verify end-to-end user journeys
- `[ ]` Generate walkthrough demonstration video/recording
