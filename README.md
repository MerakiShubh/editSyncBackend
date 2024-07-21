# codeSync Backend

codeSync is a real-time collaborative code editor that allows multiple users to join, edit, and run JavaScript code synchronously. The backend handles real-time updates, messaging, and execution of JavaScript code, ensuring a seamless collaborative experience.

## Live Demo

Check out the live application [here](https://editsync.merakishubh.com/).

## Features

- Real-time code editing with multiple users
- Notifications for users joining and leaving rooms
- Run JavaScript code and view output in real-time
- Syntax highlighting and auto-closing brackets
- Ten different themes to choose from
- Unique room IDs for each session
- Ignoring comments and running only code parts

## Technologies Used

### Backend

- **Node.js**: JavaScript runtime for building the server.
- **Express**: Web framework for handling routes and middleware.
- **Socket.IO**: Library for real-time web applications, enabling real-time, bi-directional communication.
- **Twilio**: Messaging service for secure communications.
- **Redis**: In-memory data structure store, used for caching user IDs.
- **Node.js Child Process**: Module for executing JavaScript code.

### Containerization and Deployment

- **Docker**: For containerizing the application.
- **NGINX**: Web server for reverse proxying and load balancing.
- **Render**: Cloud platform for deploying the application.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Docker

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MerakiShubh/editSyncBackend.git
   cd codeSync-backend
   ```

2. Install Dependencies
   npm install

3. npm start

## Blog

For a detailed explanation about the development process and features of codeSync, check out the blog post [here](https://merakishubh.hashnode.dev/codesync-building-a-real-time-collaborative-code-editor).
