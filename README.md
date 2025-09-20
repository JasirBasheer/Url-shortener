# URL Shortener Application

A full-stack URL shortener application built with Node.js, Express, TypeScript, React, and MongoDB. This application allows users to create short URLs, track analytics, and manage their links with a modern, responsive interface.

## Features

### Backend Features
- **User Authentication**: JWT-based authentication with refresh tokens
- **URL Shortening**: Create short URLs with custom codes
- **Analytics Tracking**: Comprehensive click tracking with IP, user agent, referrer, and geographic data
- **URL Management**: Update, delete, and bulk operations on URLs
- **URL Expiration**: Set expiration dates for URLs
- **Pagination**: Efficient pagination for large datasets
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive validation using Joi schemas
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Logging**: Structured logging with Winston
- **Dependency Injection**: Clean architecture with TSyringe

### Frontend Features
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Responsive Design**: Mobile-first responsive design
- **Authentication**: Sign up, sign in, and protected routes
- **URL Management**: Create, view, edit, and delete URLs
- **Analytics Dashboard**: Visual analytics with charts and statistics
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Public URL Creation**: Create short URLs without authentication
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

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── app.ts                 # Express app configuration
│   │   ├── index.ts              # Server entry point
│   │   ├── container/            # Dependency injection container
│   │   ├── controllers/          # Request handlers
│   │   ├── middleware/           # Express middleware
│   │   ├── models/               # MongoDB models
│   │   ├── repositories/         # Data access layer
│   │   ├── routes/               # API routes
│   │   ├── services/             # Business logic
│   │   ├── types/                # TypeScript types and DTOs
│   │   ├── utils/                # Utility functions
│   │   └── validators/           # Input validation schemas
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Main app component
│   │   ├── main.tsx              # App entry point
│   │   ├── components/           # Reusable UI components
│   │   ├── features/             # Feature-based modules
│   │   │   ├── auth/             # Authentication feature
│   │   │   └── url/              # URL management feature
│   │   ├── pages/                # Page components
│   │   ├── routes/               # Route definitions
│   │   ├── types/                # TypeScript types
│   │   └── lib/                  # Utility functions
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/me` - Get current user

### URLs
- `POST /api/urls/create` - Create short URL (authenticated)
- `POST /api/urls/create-public` - Create short URL (public)
- `GET /api/urls/user/urls` - Get user's URLs (authenticated)
- `PUT /api/urls/:urlId` - Update URL (authenticated)
- `DELETE /api/urls/:urlId` - Delete URL (authenticated)
- `POST /api/urls/bulk-delete` - Bulk delete URLs (authenticated)
- `GET /api/urls/:shortCode` - Redirect to original URL
- `GET /api/urls/stats/:shortCode` - Get URL statistics
- `GET /api/urls/analytics/:shortCode` - Get URL analytics
- `GET /api/urls/analytics/:shortCode/stats` - Get detailed analytics
- `GET /api/urls/top` - Get top URLs

## Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  password: string (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### URLs Collection
```typescript
{
  _id: ObjectId,
  url: string,
  shortCode: string (unique),
  userId: string,
  clicks: number,
  title?: string,
  description?: string,
  expiresAt?: Date,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### URL Analytics Collection
```typescript
{
  _id: ObjectId,
  urlId: string,
  shortCode: string,
  ipAddress: string,
  userAgent: string,
  referrer?: string,
  country?: string,
  city?: string,
  clickedAt: Date
}
```

## Environment Variables

### Backend (.env)
```env
PORT=3000
DB_URI=mongodb://localhost:27017/url-shortener
CORS_ORIGIN=http://localhost:5173
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_RESET_PASSWORD_SECRET=your-reset-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECRET=your-cookie-secret
NODE_ENV=development
FRONTEND_BASE_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

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

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

