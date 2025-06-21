# Community Frontend

A modern React application for community engagement, featuring groups, posts, and user interactions. Built with React, Vite, and Tailwind CSS.

## Features

- **User Authentication**: Register, login, and profile management
- **Groups Management**: 
  - Browse, create, join, and leave groups
  - Public and private group options
  - Group member management for admins
- **Posts and Content**:
  - Create posts within groups you're a member of
  - Expandable post content with "Read more/Show less" functionality
  - Group-specific post feeds
- **Responsive UI**: Mobile-friendly design with Tailwind CSS

## Prerequisites

- Node.js (v16+)
- npm
- Backend API running (see API Configuration section)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd community-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.sample .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Configuration

The application requires a backend API. Configure the API endpoint in your `.env` file:

```
VITE_API_BASE_URL=http://localhost:8000/api/
```

## Project Structure

```
├── public/              # Static assets
├── src/
│   ├── api/            # API configuration and services
│   ├── components/     # Reusable UI components
│   ├── context/        # React context providers
│   ├── pages/          # Page components
│   └── App.jsx         # Main application component
├── .env                # Environment variables (not in version control)
├── .env.sample         # Sample environment variables
└── README.md           # Project documentation
```

## Key Components

- **Groups**: Browse and manage community groups
- **GroupDetail**: View group information, members, and posts
- **CreatePost**: Create new posts in groups you're a member of
- **PostCard**: Display post content with expandable text

## User Permissions

- Users must be members of a group to create posts in that group
- Group admins can view members list and edit group details
- Only authenticated users can access groups and posts functionality

## Development

This project uses:
- **React** for the UI framework
- **React Router** for navigation
- **Axios** for API requests
- **Tailwind CSS** for styling
- **Vite** for fast development and building
