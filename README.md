# URL Shortener Application

A full-stack URL shortener application built with Node.js, Express, TypeScript, React, and MongoDB. This application allows users to create short URLs, track  and manage their links with a modern, responsive interface.

## Features

### Backend Features
- **User Authentication**: JWT-based authentication with refresh tokens
- **URL Shortening**: Create short URLs with custom codes
- **URL Management**: Update, delete, and bulk operations on URLs
- **Pagination**: Efficient pagination for large datasets
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Dependency Injection**: Clean architecture with TSyringe

### Frontend Features
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Responsive Design**: Mobile-first responsive design
- **Authentication**: Sign up, sign in, and protected routes
- **URL Management**: Create, view, edit, and delete URLs
- **Copy to Clipboard**: Easy sharing of short URLs
- **Search and Filter**: Advanced search and sorting capabilities

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **Joi** for validation
- **Winston** for logging
- **TSyringe** for dependency injection
- **bcrypt** for password hashing
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Rate limiting** with express-rate-limit

### Frontend
- **React 18** with **TypeScript**
- **Vite** for build tooling
- **React Router** for navigation
- **React Query** for data fetching
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **Axios** for HTTP requests

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

## Usage

1. **Start the application**:
   - Backend runs on `http://localhost:3000`
   - Frontend runs on `http://localhost:5173`

2. **Create an account** or use the public URL shortener on the landing page

3. **Sign in** to access the dashboard with full features

4. **Create short URLs** with optional custom codes, titles, descriptions, and expiration dates

5. **View analytics** including click counts, geographic data, referrers, and time-based statistics

6. **Manage URLs** with bulk operations, search, and filtering

## Key Features Explained

### Analytics Tracking
The application tracks comprehensive analytics for each URL click:
- IP address and geographic location
- User agent and device information
- Referrer information
- Click timestamps
- Aggregated statistics (total clicks, unique visitors, top referrers, etc.)

### URL Expiration
URLs can be set to expire at a specific date and time. Expired URLs will not redirect and will show an appropriate error message.

### Custom Short Codes
Users can create memorable custom short codes for their URLs, with validation to ensure they contain only allowed characters.

### Bulk Operations
Users can select multiple URLs and perform bulk operations like deletion, making it easy to manage large numbers of URLs.

### Responsive Design
The application is fully responsive and works seamlessly on desktop, tablet, and mobile devices.

## Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- Protected routes and middleware

## Performance Features

- Database indexing for fast queries
- Pagination for large datasets
- React Query for efficient data fetching and caching
- Optimized database queries with aggregation pipelines
- Lazy loading and code splitting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


For support or questions, please open an issue in the repository.

