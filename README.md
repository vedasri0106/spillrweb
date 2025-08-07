 Spillr – Anonymous Confession Web App
Spillr is a modern full-stack **confession-based social media web application**, where users can post anonymous or public confessions, like, comment, explore, chat (live + DMs), and manage their profiles — just like Instagram but anonymous.

---

## 🚀 Tech Stack

### 🔧 Frontend:
- Framework: [Next.js 15](https://nextjs.org/)
- Styling: Tailwind CSS
- State: React hooks
- Auth: JWT stored in `localStorage`
- Features: Anonymous/Public Posts, Reactions, Comments, Live Chat, Private DMs, User Profiles

### 🛠 Backend:
- Framework: Node.js + Express
- ORM: Prisma
- Database: PostgreSQL
- Realtime: Socket.IO
- Auth: JWT
- File Uploads: Multer

---

## 📁 Folder Structure

```bash
spillrweb/
├── confessionweb-frontend/   # Frontend (Next.js)
└── confessionweb-backend/    # Backend (Express + Prisma)
````

---

## 🧠 How to Run the Project Locally

### 1️⃣ Clone the Repositories

```bash
git clone https://github.com/vedasri0106/spillrweb.git
cd spillrweb
```

> Make sure the project has two folders: `confessionweb-frontend/` and `confessionweb-backend/`

---

## 📦 Backend Setup (Node.js + Prisma)

### Step 1: Go to backend folder

```bash
cd confessionweb-backend
```

### Step 2: Install backend dependencies

```bash
npm install
```

### Step 3: Setup environment variables

Create a `.env` file:

```env
PORT=4000
DATABASE_URL=postgresql://<your_username>:<your_password>@localhost:5432/confessionweb_app
JWT_SECRET=supersecretspillr
```

> Replace `<your_username>` and `<your_password>` with your local PostgreSQL credentials.

### Step 4: Push schema to database

```bash
npx prisma db push
```

(Optional Seed):

```bash
npx prisma migrate dev --name init
```

### Step 5: Start backend server

```bash
npm run dev
```

---

## 🎨 Frontend Setup (Next.js)

### Step 1: Go to frontend folder

```bash
cd confessionweb-frontend
```

### Step 2: Install frontend dependencies

```bash
npm install
```

### Step 3: Start frontend server

```bash
npm run dev
```

It should open at: [http://localhost:3000](http://localhost:3000)

---

## 💬 Features

| Feature          | Status | Notes                      |
| ---------------- | ------ | -------------------------- |
| ✅ Auth           | Done   | JWT-based login & register |
| ✅ Confessions    | Done   | Anonymous + Public posts   |
| ✅ Reactions      | Done   | Like emojis                |
| ✅ Comments       | Done   | On each post               |
| ✅ Live Chat      | Done   | Real-time via Socket.IO    |
| ✅ Private DMs    | Done   | Room-based messaging       |
| ✅ Edit Profile   | Done   | Upload pic, update bio     |
| ✅ Media Uploads  | Done   | Via Multer                 |
| ✅ Feed + Explore | Done   | Scrollable posts           |

---

## 💡 Useful Commands

### Prisma (backend)

* Format schema:

  ```bash
  npx prisma format
  ```
* View DB in browser:

  ```bash
  npx prisma studio
  ```

### Git (for both frontend & backend)

```bash
git init
git add .
git commit -m "Initial Commit"
git remote add origin <your_repo_url>
git push -u origin master
```

---

## 📸 Screenshots (Optional)


---

## 🔐 Authentication

* Token is stored in `localStorage`
* All protected routes require:
  `Authorization: Bearer <token>`

---

## 🧑‍💻 Contribution Guide

> Feel free to fork and contribute!

```bash
git checkout -b new-feature
git commit -m "Added feature"
git push origin new-feature
```

---

## 🌐 Deployment Tips

* Backend: Render / Railway / Fly.io
* Frontend: Vercel (next.js ready)
* DB: Supabase / NeonDB / Railway PostgreSQL

---

## 👩‍💻 Author

Made with ❤️ by [vedasri0106](https://github.com/vedasri0106)