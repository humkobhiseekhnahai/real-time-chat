# Real-Time Chat Application

This is a **real-time chat application** that allows users to exchange messages instantly. The application is built using websocket library and redis and provides features such as announcement, dynamic chat functionality, and responsive UI design.

<img width="1440" alt="Screenshot 2024-10-25 at 11 35 45 AM" src="https://github.com/user-attachments/assets/c9302352-2748-4f3c-837a-dd443ee2d9b2">


## Installation

Follow these steps to set up and run the project locally.

1. **Clone the repository:**

   ```bash
   git clone https://github.com/humkobhiseekhnahai/real-time-chat.git
   ```
   start a redis server locally

4. **Run the application:**

   - **Backend (Server)**:

     ```bash
     cd backend
     npm i
     tsc -b
     node dist/index.js
     ```

   - **Frontend (Client)**:

     Open a new terminal window and run the following commands:

     ```bash
     cd frontend
     npm i
     npm run dev
     ```

   This will start both the backend and frontend servers locally.

5. **Access the Application:**

   Open your browser and navigate to `http://localhost:5173/` to use the real-time chat application.
