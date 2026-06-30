# TutorLink - Smart Tutor Recommendation System

## Project Overview

TutorLink is a Final Year Computer Science project.

It is a web application that connects students/parents looking for home tuition with tutors.

The primary objective is to demonstrate the implementation of Computer Science algorithms within a real-world application rather than building a feature-rich commercial platform.

The system allows students to search tutors, submit tuition requests, and receive intelligent tutor recommendations.

The recommendation system is the core feature of the project.

---

# Tech Stack

Frontend
- React (Vite)
- JavaScript
- Tailwind CSS
- React Router
- Axios

Backend
- Node.js
- Express.js

Database
- MongoDB
- Mongoose

Authentication
- JWT
- bcrypt

Maps
- OpenStreetMap (Leaflet)

Version Control
- Git
- GitHub

---

# Development Principles

- Use JavaScript only.
- Do not use TypeScript.
- Follow MVC architecture.
- Keep backend and frontend separate.
- Write clean, reusable code.
- Follow SOLID principles where practical.
- Use REST APIs.
- Keep files modular.
- Never duplicate logic.
- Add comments only where necessary.
- Validate every input.
- Handle all errors gracefully.
- Keep UI simple and professional.
- Build incrementally.
- Never modify unrelated files.

---

# User Roles

## Student

Can

- Register
- Login
- Edit Profile
- Search Tutors
- Filter Tutors
- View Tutor Profiles
- Get Smart Recommendations
- Send Tuition Requests
- View Request Status
- Leave Reviews

---

## Tutor

Can

- Register
- Login
- Create Profile
- Update Profile
- Add Subjects
- Set Classes
- Set Hourly Fee
- Set Experience
- Set Qualifications
- Set Availability
- Add Location
- Accept or Reject Requests
- View Reviews

---

## Admin

Can

- Login
- View Users
- Approve Tutors
- Reject Tutors
- Delete Users
- View Requests
- View Statistics

---

# Main Algorithms

The recommendation engine consists of three algorithms.

---

## Algorithm 1

K-Means Clustering

Purpose

Cluster tutors based on similar characteristics.

Features used

- Latitude
- Longitude
- Hourly Fee
- Experience
- Rating

Output

Each tutor belongs to one cluster.

Student recommendations should first search inside the best cluster.

---

## Algorithm 2

Haversine Formula

Purpose

Calculate real geographical distance.

Input

Student latitude

Student longitude

Tutor latitude

Tutor longitude

Output

Distance in kilometers.

---

## Algorithm 3

Weighted Recommendation

Purpose

Rank tutors inside the selected cluster.

Scoring

Distance
35%

Subject Match
25%

Availability
15%

Budget
10%

Experience
10%

Rating
5%

Return Top 5 tutors.

---

# Recommendation Workflow

Student searches

↓

Apply Filters

↓

Run K-Means

↓

Select Best Cluster

↓

Calculate Haversine Distance

↓

Calculate Weighted Recommendation Score

↓

Sort Descending

↓

Return Top Five Tutors

---

# Database Collections

Student

Tutor

Admin

TuitionRequest

Review

Notification

---

# Folder Structure

client/

src/

components/

pages/

layouts/

hooks/

services/

context/

utils/

assets/

server/

controllers/

routes/

models/

middleware/

algorithms/

services/

utils/

config/

uploads/

---

# API Style

REST APIs

Example

GET /api/tutors

POST /api/auth/login

POST /api/auth/register

GET /api/recommendations

POST /api/request

PATCH /api/request/:id

DELETE /api/users/:id

---

# UI Style

Simple

Minimal

Professional

Responsive

Modern Cards

Rounded Components

Tailwind CSS

No unnecessary animations.

---

# Coding Rules

Always explain files before generating them.

Generate backend before frontend.

One phase at a time.

Do not skip implementation steps.

Do not assume files already exist.

Wait for approval before continuing.

Never rewrite existing code unless requested.

---

# Performance Goals

Keep recommendation code modular.

Algorithm files should exist inside

server/algorithms/

KMeans.js

Haversine.js

RecommendationEngine.js

---

# Expected Outcome

A complete Final Year Computer Science project demonstrating

- MVC Architecture
- REST APIs
- JWT Authentication
- MongoDB
- React
- K-Means Clustering
- Haversine Distance Formula
- Weighted Recommendation Algorithm
- Clean UI
- Proper Documentation