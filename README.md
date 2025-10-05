# Theme Browser - Backend

This is the backend service for the **Theme Browser** application.  
It handles authentication, theme data management, and communication with the database.

---

## 🚀 Features
- Node.js & Express REST API
- MongoDB database
- JWT authentication
- Email sending support
- Error handling middleware

---

## 📂 Tech Stack
- **Node.js** (Express)
- **MongoDB** (Mongoose)
- **JWT** for authentication

---

## ⚙️ Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/ksnehhaa/Theme-browser-backend.git
cd Theme-browser-backend
2️⃣ Install dependencies
bash
Copy
Edit
npm install
3️⃣ Environment variables
Create a .env file in the backend root and set the required variables.
⚠️ Environment values are not included for security reasons — contact the repository owner to get them.

🛠 Run Locally

npm run dev
Backend will run on http://localhost:5000

📡 API Overview
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	    Login & get token
GET	  /api/themes	        Fetch all themes

🌐 Live API
The backend is live here:
https://your-render-app-url.onrender.com

Replace this URL with your actual Render deployment link once deployed.

📝 License
MIT License © 2025 ksnehhaa



Once you deploy to **Render**, we’ll just replace:  
https://your-render-app-url.onrender.com
