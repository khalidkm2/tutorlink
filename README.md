# TutorLink

TutorLink is a smart tutor recommendation platform that helps students discover the most suitable tutors through an intelligent recommendation engine. Rather than displaying tutors using simple keyword searches or basic filters, the platform evaluates multiple factors to provide personalized and relevant recommendations.

The recommendation engine combines **K-Means Clustering**, the **Haversine Formula**, and a **weighted ranking algorithm** to analyze tutor similarity, geographical proximity, subject relevance, availability, budget, experience, and ratings. An interactive map further enhances the search experience by visualizing nearby tutors, making the recommendation process both efficient and intuitive.

---

## ✨ Features

* 🔍 Smart tutor recommendation system
* 🧠 K-Means Clustering for tutor grouping
* 📍 Location-based matching using the Haversine Formula
* ⚖️ Weighted recommendation algorithm for tutor ranking
* 🗺️ Interactive map for tutor visualization
* 👨‍🎓 Student and tutor profile management
* 📅 Tuition request and booking workflow
* ⭐ Review and rating system
* 🔐 Secure role-based authentication

---

## 🧠 Recommendation Workflow

1. Filter tutors based on the requested subject.
2. Group similar tutors using **K-Means Clustering**.
3. Compare the student's preferences with cluster centroids.
4. Calculate geographical distance using the **Haversine Formula**.
5. Rank tutors using a **weighted recommendation algorithm**.
6. Return the highest-ranked tutor recommendations.

---

## 📊 Ranking Factors

The recommendation engine evaluates tutors using multiple criteria:

* Subject relevance
* Geographical distance
* Availability
* Budget compatibility
* Teaching experience
* Tutor ratings

---

## 🛠️ Installation

### Prerequisites

Make sure the following are installed:

* Node.js (v18 or later recommended)
* npm
* MongoDB (Local or MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/tutorlink.git
cd tutorlink
```

### 2. Install Dependencies

Install dependencies for both the server and client.

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 4. Start the Backend

```bash
cd server
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### 5. Start the Frontend

Open another terminal.

```bash
cd client
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

### 6. Open the Application

Visit:

```text
http://localhost:5173
```

---

## 📂 Project Structure

```text
TutorLink/
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── algorithms/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 📜 Available Scripts

### Client

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Server

```bash
npm run dev      # Start backend with hot reload
npm start        # Start production server
```

---

## 🚀 Future Enhancements

* AI-powered personalized recommendations
* Live chat between students and tutors
* Online payment integration
* Video tutoring sessions
* Calendar-based scheduling
* Improved recommendation optimization

---

## 📄 License

This project was developed as a **Final Year Computer Science Project** for educational purposes. Feel free to use or modify it for learning and research.
