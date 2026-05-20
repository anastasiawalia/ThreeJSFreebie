# Loading Animation Freebie

![Frame 2](https://github.com/user-attachments/assets/2c8d61eb-4e46-4966-91e8-8ab3d1f42c96)


A React web application featuring an interactive hero page with a Three.js particle animation background. The page includes a beautiful hero section with Tailwind CSS styling and an animated particle system that responds to user interaction.

## Prerequisites

Before you can run this project, you need to have Node.js installed on your computer. Node.js is a free program that allows you to run JavaScript applications.

### Installing Node.js

**Don't worry if you don't have Node.js installed!** Follow these steps based on your operating system:

#### For Windows:
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Click on the "Download" button (it will automatically detect you're on Windows)
3. Download the LTS (Long Term Support) version - this is the recommended version
4. Run the downloaded installer file (it will be named something like `node-vXX.X.X-x64.msi`)
5. Follow the installation wizard:
   - Click "Next" on all screens
   - Accept the license agreement
   - Keep all default settings
   - Click "Install" (you may need to enter your computer password)
6. Once installation is complete, click "Finish"

#### For Mac:
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Click on the "Download" button (it will automatically detect you're on Mac)
3. Download the LTS (Long Term Support) version - this is the recommended version
4. Open the downloaded file (it will be named something like `node-vXX.X.X.pkg`)
5. Follow the installation wizard:
   - Click "Continue" on all screens
   - Accept the license agreement
   - Keep all default settings
   - Click "Install" (you will need to enter your Mac password)
6. Once installation is complete, click "Close"

#### For Linux:
1. Open your terminal
2. Run one of these commands (depending on your Linux distribution):

   **For Ubuntu/Debian:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

   **For Fedora/RHEL:**
   ```bash
   curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
   sudo dnf install -y nodejs
   ```

### Verifying Node.js Installation

After installing Node.js, you should verify it's working:

1. Open your computer's terminal/command prompt:
   - **Windows**: Press `Win + R`, type `cmd`, and press Enter
   - **Mac**: Press `Cmd + Space`, type `Terminal`, and press Enter
   - **Linux**: Open your terminal application

2. Type the following command and press Enter:
   ```bash
   node --version
   ```

3. You should see a version number (like `v20.x.x` or `v22.x.x`). If you see an error, Node.js may not be installed correctly.

4. Also check npm (Node Package Manager) is installed:
   ```bash
   npm --version
   ```

   You should see another version number. npm comes automatically with Node.js.

## Getting Started

Once you have Node.js installed, follow these steps to run the project:

### Step 1: Open the Project Folder

1. Navigate to the project folder on your computer
2. Note the full path to this folder (you'll need it in the next step)

### Step 2: Open Terminal/Command Prompt

- **Windows**: Press `Win + R`, type `cmd`, and press Enter
- **Mac**: Press `Cmd + Space`, type `Terminal`, and press Enter
- **Linux**: Open your terminal application

### Step 3: Navigate to the Project Folder

In the terminal, type `cd` followed by a space, then drag and drop the project folder into the terminal window (this will automatically paste the path), and press Enter.

**Example:**
```bash
cd /Users/anastasiawalia/Documents/LoadingAnimationFreebie
```

Or on Windows:
```bash
cd C:\Users\YourName\Documents\LoadingAnimationFreebie
```

### Step 4: Install Dependencies

This project uses several external libraries (called "dependencies"). You need to download them before you can run the project.

In the terminal, type the following command and press Enter:

```bash
npm install
```

**What this does:** This command reads the `package.json` file and downloads all the required libraries for the project. This may take a few minutes the first time.

**Key dependencies included:**
- **React** - JavaScript library for building user interfaces
- **Three.js** - 3D graphics library for the particle animation
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Vite** - Fast build tool and development server

**You'll know it's working when you see:**
- A progress bar or list of packages being downloaded
- Messages like "added XXX packages"
- No error messages

**If you see errors:**
- Make sure you're in the correct folder (the one containing `package.json`)
- Make sure Node.js is installed correctly (check with `node --version`)
- Try running the command again

### Step 5: Start the Development Server

Once the installation is complete, start the development server by typing:

```bash
npm run dev
```

**What this does:** This starts a local web server on your computer so you can view the website.

**You'll know it's working when you see:**
- A message like "Local: http://localhost:3000"
- The terminal shows the server is running (it won't return to a prompt)

### Step 6: View the Website

1. Open your web browser (Chrome, Firefox, Safari, Edge, etc.)
2. Go to the address shown in the terminal (usually `http://localhost:3000`)
3. You should see the website!

**To stop the server:** Press `Ctrl + C` (or `Cmd + C` on Mac) in the terminal window.

## Troubleshooting

### "npm: command not found" or "node: command not found"
- Node.js is not installed or not in your system PATH
- Reinstall Node.js from [nodejs.org](https://nodejs.org/)
- After installing, close and reopen your terminal

### "Cannot find module" errors
- Make sure you ran `npm install` in the project folder
- Delete the `node_modules` folder and `package-lock.json` file, then run `npm install` again

### Port 3000 is already in use
- Another program is using port 3000
- Close other applications or change the port in `vite.config.js`

### The website doesn't load
- Make sure the development server is running (`npm run dev`)
- Check that you're using the correct URL from the terminal
- Try refreshing the page

## Project Structure

- `src/` - Source code files
  - `components/` - React components
    - `Hero.jsx` - Main hero section component
    - `ThreeBackground.jsx` - Three.js particle animation background
  - `styles/` - CSS and styling files (Tailwind CSS configuration)
  - `utils/` - Utility functions
- `public/` - Static assets
- `package.json` - Project configuration and dependencies
- `vite.config.js` - Build tool configuration

## Features

- **Interactive Particle Animation**: Three.js-powered particle system that forms a globe, explodes on mouse movement or click, and reconnects when the mouse stops
- **Responsive Design**: Works beautifully on all screen sizes
- **Modern Styling**: Built with Tailwind CSS v4
- **Fast Development**: Powered by Vite for instant hot module replacement

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build

## Need Help?

If you encounter any issues:
1. Make sure Node.js is installed correctly
2. Make sure you're in the correct project folder
3. Try deleting `node_modules` and running `npm install` again
4. Check that all files from the project are present
