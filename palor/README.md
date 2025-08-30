# 💇‍♀️ Palor Salon Management System

A modern, full-stack salon management system built with React, Node.js, and MongoDB. This application helps salon owners manage appointments, services, customers, payments, and provides comprehensive analytics.

## 🌟 Features

### 👥 User Management
- **Customer Registration & Authentication**
- **Staff Management** with role-based access
- **Admin Dashboard** with full system control
- **Google OAuth Integration**
- **Password Reset** functionality

### 📅 Appointment Management
- **Online Booking System**
- **Calendar Integration**
- **Appointment Status Tracking** (Pending, Confirmed, Completed, Cancelled)
- **Walk-in Customer Support**
- **Staff Assignment**

### 💼 Service Management
- **Service Catalog** with pricing
- **Service Categories**
- **Duration Management**
- **Service Descriptions** and images

### 💳 Payment Processing
- **Multiple Payment Methods** (Cash, Card, PayPal)
- **Payment History Tracking**
- **Refund Management**
- **Payment Statistics**
- **Transaction Reports**

### 📊 Analytics & Reports
- **Revenue Analytics** (Daily, Weekly, Monthly)
- **Popular Services** tracking
- **Customer Growth** metrics
- **Appointment Statistics**
- **Dashboard Overview** with key metrics

### 🔧 Additional Features
- **Daily Sales Tracking**
- **Staff Experience Management**
- **Email Notifications**
- **File Upload** (Cloudinary integration)
- **Responsive Design**

## 🏗️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Nodemailer** - Email service
- **PayPal SDK** - Payment processing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

## 📁 Project Structure

```
palor/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   │   └── paypal.js    # PayPal configuration
│   │   ├── controller/      # Business logic
│   │   │   ├── appointment.js
│   │   │   ├── auth.controllers.js
│   │   │   ├── dashbaord.controller.js
│   │   │   ├── payment.controller.js
│   │   │   ├── service.controller.js
│   │   │   ├── transaction.controller.js
│   │   │   └── user.controllers.js
│   │   ├── db/              # Database connection
│   │   ├── middleware/      # Custom middleware
│   │   │   ├── auth.middleware.js
│   │   │   └── multer.middleware.js
│   │   ├── models/          # Database schemas
│   │   │   ├── appointment.model.js
│   │   │   ├── service.models.js
│   │   │   ├── transaction.models.js
│   │   │   └── user.models.js
│   │   ├── routes/          # API routes
│   │   │   ├── appointment.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   ├── payment.routes.js
│   │   │   ├── service.routes.js
│   │   │   ├── transaction.routes.js
│   │   │   └── user.routes.js
│   │   ├── utils/           # Utility functions
│   │   │   ├── apiError.js
│   │   │   ├── apiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── cloudnary.js
│   │   │   └── sendMail.js
│   │   ├── app.js           # Express app setup
│   │   └── index.js         # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main app component
│   │   └── index.css       # Global styles
│   ├── tailwind.config.js  # Tailwind configuration
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhisek59/palour.git
   cd palour
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Variables**
   
   Create a `.env` file in the backend directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/palor_salon
   
   # JWT
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # PayPal
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   
   # Environment
   NODE_ENV=development
   
   # Server
   PORT=8000
   ```

5. **Start the Development Servers**
   
   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000`

## 📚 API Documentation

### Authentication Endpoints
```
POST   /api/v1/users/signup           # User registration
POST   /api/v1/users/login            # User login
POST   /api/v1/users/logout           # User logout
POST   /api/v1/users/google           # Google OAuth
POST   /api/v1/users/forgetPassword   # Password reset
PATCH  /api/v1/users/changePassword   # Change password
```

### Appointment Endpoints
```
POST   /api/v1/appointments           # Create appointment
GET    /api/v1/appointments           # Get all appointments
GET    /api/v1/appointments/:id       # Get appointment by ID
PUT    /api/v1/appointments/:id       # Update appointment
DELETE /api/v1/appointments/:id       # Delete appointment
```

### Service Endpoints
```
POST   /api/v1/services               # Create service
GET    /api/v1/services               # Get all services
GET    /api/v1/services/:id           # Get service by ID
PUT    /api/v1/services/:id           # Update service
DELETE /api/v1/services/:id           # Delete service
```

### Payment Endpoints
```
POST   /api/v1/payments/cash          # Cash payment
POST   /api/v1/payments/card          # Card payment
POST   /api/v1/payments/paypal/create-order  # Create PayPal order
POST   /api/v1/payments/paypal/capture       # Capture PayPal payment
GET    /api/v1/payments/history/:customerId  # Payment history
POST   /api/v1/payments/refund        # Process refund
```

### Dashboard Endpoints
```
GET    /api/v1/dashboard/overview           # Dashboard overview
GET    /api/v1/dashboard/revenue-analytics  # Revenue analytics
GET    /api/v1/dashboard/popular-services   # Popular services
GET    /api/v1/dashboard/customer-growth    # Customer growth
```

## 🔒 Authentication & Authorization

The application uses **JWT (JSON Web Tokens)** for authentication with role-based access control:

- **Customer**: Can book appointments, view history, manage profile
- **Staff**: Can manage assigned appointments, view customer details
- **Admin**: Full system access, dashboard analytics, user management

## 💾 Database Schema

### User Model
```javascript
{
  fullName: String,
  email: String,
  password: String,
  role: ['customer', 'staff', 'admin'],
  avatar: String,
  experience: [Object], // For staff
  refreshToken: String
}
```

### Appointment Model
```javascript
{
  customerId: ObjectId,
  serviceId: ObjectId,
  appointmentDate: Date,
  status: ['pending', 'confirmed', 'completed', 'cancelled'],
  notes: String
}
```

### Service Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  duration: Number,
  category: String,
  image: String
}
```

### Transaction Model
```javascript
{
  customerId: ObjectId,
  serviceId: ObjectId,
  amount: Number,
  paymentMethod: String,
  transactionDate: Date
}
```

## 🎨 UI/UX Features

- **Responsive Design** - Works on all devices
- **Modern UI** - Clean, professional interface
- **Smooth Animations** - Enhanced user experience
- **Dark/Light Theme** support
- **Interactive Components** - Modals, dropdowns, forms
- **Loading States** - Better user feedback

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)
1. Set environment variables
2. Configure MongoDB Atlas
3. Deploy using your preferred platform

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abhisek Dahal**
- GitHub: [@abhisek59](https://github.com/abhisek59)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the flexible database
- PayPal for payment processing integration

## 📞 Support

If you have any questions or need help with setup, please create an issue in the GitHub repository or contact the author.

---

**Happy Coding! 💻✨**
