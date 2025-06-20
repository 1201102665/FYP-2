# 🛫 AeroTrav - Travel Made Easier

A comprehensive travel booking platform built with modern web technologies, featuring flight search, hotel booking, car rentals, and package deals.

## ✨ Features

### 🌟 Core Features
- **Flight Search & Booking** - Real-time flight search using Amadeus API
- **Hotel Reservations** - Browse and book accommodations worldwide
- **Car Rentals** - Rent vehicles for your travel needs
- **Travel Packages** - Pre-designed travel packages with flights + hotels
- **AI Travel Assistant** - Get personalized travel recommendations
- **User Authentication** - Secure login and registration system
- **Booking Management** - Track and manage your bookings
- **Reviews & Ratings** - Rate and review your travel experiences

### 🛠️ Technology Stack

#### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern styling
- **Shadcn/ui** for reusable UI components
- **React Router** for navigation
- **Context API** for state management

#### Backend
- **Node.js** with Express.js
- **MySQL** database with XAMPP
- **Amadeus Travel API** for real flight data
- **JWT Authentication** for secure user sessions
- **CORS** enabled for cross-origin requests
- **Rate limiting** for API protection

#### Development Tools
- **ESLint** for code linting
- **PostCSS** for CSS processing
- **Vite** for module bundling
- **Git** for version control

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- XAMPP (for MySQL database)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/1201102665/FYP_AeroTrav.git
   cd FYP_AeroTrav
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   ```

3. **Set up the database**
   - Start XAMPP and enable MySQL
   - Import the database schema from `database_schema.sql`
   - Update database credentials in `server/.env`

4. **Configure environment variables**
   
   Create `server/.env` file:
   ```env
   PORT=3001
   NODE_ENV=development
   AMADEUS_API_KEY=your_amadeus_api_key
   AMADEUS_API_SECRET=your_amadeus_api_secret
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=aerotrav_db
   DB_USER=root
   DB_PASSWORD=
   ```

5. **Start the development servers**
   
   Terminal 1 (Frontend):
   ```bash
   npm run dev
   ```
   
   Terminal 2 (Backend):
   ```bash
   cd server
   node index.js
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Flight Endpoints
- `GET /api/flights/browse` - Browse popular flights
- `POST /api/flights/search` - Search flights with criteria
- `GET /api/flights/:id` - Get flight details

### Hotel Endpoints
- `GET /api/hotels/search` - Search hotels
- `GET /api/hotels/:id` - Get hotel details

### Car Rental Endpoints
- `GET /api/cars/search` - Search rental cars
- `GET /api/cars/:id` - Get car details

### Booking Endpoints
- `POST /api/bookings/create` - Create new booking
- `GET /api/bookings/user/:userId` - Get user bookings
- `PUT /api/bookings/:id` - Update booking status

## 🎯 Key Features Implemented

### ✅ Flight Search Integration
- **Amadeus API Integration** - Real-time flight data
- **Automatic Token Management** - No 30-minute expiry issues
- **Search Filters** - Price, airline, stops, departure time
- **Responsive Design** - Works on all devices

### ✅ User Experience
- **Modern UI/UX** - Clean, intuitive interface
- **Fast Loading** - Optimized performance
- **Error Handling** - Graceful error messages
- **Loading States** - Visual feedback for users

### ✅ Security Features
- **JWT Authentication** - Secure user sessions
- **Rate Limiting** - Prevent API abuse
- **CORS Protection** - Secure cross-origin requests
- **Input Validation** - Prevent malicious inputs

## 🔧 Development

### Project Structure
```
FYP_AeroTrav/
├── public/                 # Static assets
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── contexts/         # React contexts
│   └── hooks/            # Custom hooks
├── server/                # Backend source code
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── config/           # Configuration files
│   └── utils/            # Utility functions
├── database_schema.sql   # Database schema
└── README.md            # Project documentation
```

### Available Scripts

Frontend:
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

Backend:
```bash
node index.js      # Start server
npm start         # Start server (if configured)
```

## 🌟 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**1201102665** - [GitHub Profile](https://github.com/1201102665)

## 🙏 Acknowledgments

- [Amadeus for Developers](https://developers.amadeus.com/) - Flight API
- [React](https://reactjs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Express.js](https://expressjs.com/) - Backend framework

## 📞 Support

If you have any questions or need help with the project, please:
1. Check the [Issues](https://github.com/1201102665/FYP_AeroTrav/issues) section
2. Create a new issue if your problem isn't already listed
3. Provide detailed information about your issue

---

**Made with ❤️ for travelers worldwide** 🌍
