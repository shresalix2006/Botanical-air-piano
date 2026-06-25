# 🌸 Botanical Air Piano

Live Link:- https://botanical-air-piano.vercel.app/
An antique, botanical-themed air piano. Move your hands in front of your camera to select notes, and pinch your thumb and index finger together to play them. Watch hand-drawn flowers bloom and petals fall as you compose vintage melodies.

---

## 🎨 Features
- **Touch-Free Expression**: Interactive hand-gesture controls powered by MediaPipe Hands.
- **Botanical Aesthetic**: Elegant antique styling with vintage botanical illustrations and soft, hand-drawn flower elements.
- **Visual Synthesis**: Experience rich audio feedback coupled with graceful floral animations, expanding blooms, and drifting petals that react to your gestures.

---

## 💻 Local Development

To run the Botanical Air Piano on your own computer:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### 2. Setup Instructions
1. **Extract/Clone the Project**: Navigate to your project folder.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
4. **Open in Browser**: Visit `http://localhost:3000` (or the port specified in your terminal output).

---

## 🐙 How to Put Your Project on GitHub

Follow these steps to upload your project to GitHub:

### Step 1: Create a GitHub Repository
1. Go to [GitHub](https://github.com/) and log in.
2. Click the **`+`** icon in the top-right corner and select **New repository**.
3. Give your repository a name (e.g., `botanical-air-piano`).
4. Keep the repository **Public** (or Private if you prefer).
5. **CRITICAL**: Do **NOT** check "Add a README file", "Add .gitignore", or "Choose a license" (since your project already has these files).
6. Click **Create repository**.

### Step 2: Push Your Code via Terminal
Open your computer's terminal (or VS Code terminal) in the project's root folder and run:

```bash
# Initialize git in the folder
git init

# Add all files to staging
git add .

# Create your first commit
git commit -m "initial commit: Botanical Air Piano"

# Rename branch to main
git branch -M main

# Link to your new GitHub repository (replace with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/botanical-air-piano.git

# Push the code to GitHub
git push -u origin main
```

---

## ⚡ How to Deploy on Vercel

Once your project is on GitHub, deploying to Vercel is extremely simple and takes less than a minute.

### Step 1: Connect GitHub to Vercel
1. Go to [Vercel](https://vercel.com/) and sign up or log in (sign up using your GitHub account for the smoothest integration).
2. On your Vercel Dashboard, click **Add New...** and select **Project**.

### Step 2: Import Repository
1. Under "Import Git Repository", select the **Botanical Air Piano** repository you just pushed.
2. Click **Import**.

### Step 3: Project Configuration
Vercel automatically detects that this is a **Vite** project. You do not need to change any build settings:
- **Framework Preset**: `Vite` (automatically selected)
- **Build Command**: `npm run build` (or `vite build`)
- **Output Directory**: `dist` (automatically selected)

Click **Deploy**!

### Step 4: Access Your Live Site 🎉
Vercel will build and deploy your app in about 15–30 seconds. Once complete, you will get a live URL (e.g., `https://botanical-air-piano.vercel.app`) that you can share with anyone!

---

## 📁 Project Structure

```text
├── src/
│   ├── App.tsx             # Main layout, MediaPipe initialization, synth engine & UI
│   ├── components/
│   │   └── FlowerIcon.tsx  # Hand-drawn animated botanical SVGs
│   ├── types.ts            # TypeScript definitions for specimens, petals & pipes
│   ├── index.css           # Global Tailwind CSS styles and font configurations
│   └── main.tsx            # React application entry point
├── index.html              # HTML shell & script hooks (Vite entry)
├── package.json            # Scripts, dependencies, and project metadata
├── vite.config.ts          # Vite bundler configuration
└── tsconfig.json           # TypeScript configuration
```
