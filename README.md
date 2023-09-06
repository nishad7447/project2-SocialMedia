# React Social Media

React Social Media is a web application that combines a React frontend with a Node.js Express.js backend. It provides a platform for social interactions, allowing users to connect and share their experiences.

## Demo

- **Frontend**: [React Social Media](https://onlyfriends.fun)
- **Backend**: [API Backend](https://api.onlyfriends.fun)

## Features

- **User Authentication**: Users can create accounts, log in, and securely manage each route.
- **Posting and Sharing**: Users can create and share posts, images, and updates with their connections.
- **Real-time Interactions**: Enjoy real-time messaging to stay connected.
- **User Profiles**: Users have customizable profiles where they can showcase their interests.
- **Comments and Likes**: Interact with posts through comments and likes.
- **Search**: Discover new users and content through search functionality.
- **Sponsored Ads**: Users can create sponsored ads by completing payments using Razorpay.

## Admin Panel

- **Dashboard**: The admin dashboard provides an overview of the platform's activity, including user statistics, post statistics, and ad revenue.
- **User Management**: Admins can manage user accounts, including account Block/unblock.
- **Post Management**: Admins have the ability to moderate posts, including the removal of inappropriate content.
- **Ad Management**: The admin panel allows for the management of sponsored ads, including ad creation, monitoring, and billing.

## Technologies Used

- **Frontend**:
  - React
  - Redux
  - Tailwind Css
  - RazorPay
  - Google-oauth
  - Axios (for API communication)
- **Backend**:
  - Node.js
  - Express.js
  - NodeMailer
  - Cloudinary
  - Multer
  - Mongosh 
  - JSON Web Tokens (JWT) for authentication
  - Socket.IO for real-time communication

## Deployment

This project is deployed in a distributed manner:

- **Frontend**: The frontend is hosted on Vercel and accessible at [onlyfriends.fun](https://onlyfriends.fun).
- **Backend**: The backend is hosted on AWS EC2 and accessible at [api.onlyfriends.fun](https://api.onlyfriends.fun).

## Local Development

To run the project locally, follow these steps:

### Frontend (React)

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/react-social-media.git
   
2. Change directory to client folder:

    ```bash
   cd client

3. Install dependencys:

   ```bash
   npm i

4. Run project:

   ```bash
   npm start

No need to run backend already connected with the api.onlyfriends.fun
