# AfriSense - GPS Tracking Platform

A modern, real-time GPS tracking platform built with React, TypeScript, and Vite.

## 🚀 Features

- **Real-time Tracking**: Live GPS location updates via WebSocket
- **Dual Interface**: Separate dashboards for users and administrators
- **Geofencing**: Create and manage virtual boundaries
- **Alerts**: Customizable notifications for tracking events
- **Payment Integration**: Subscription management system
- **Responsive Design**: Built with Tailwind CSS v4

## 🏗️ Project Structure

```
src/
├── app/                    # Core application (layouts, router, providers)
├── auth/                   # Authentication & authorization
├── api/                    # HTTP communication layer
├── ws/                     # WebSocket real-time layer
├── types/                  # TypeScript type definitions
├── utils/                  # Helper utilities
├── user/                   # User interface & features
├── admin/                  # Admin interface & features
└── components/             # Shared UI components
```

## 🛠️ Tech Stack

- **Framework**: React 18.3
- **Language**: TypeScript 5.6
- **Build Tool**: Vite 6.0
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/djerareou/afrisense-frontend.git

# Navigate to project directory
cd afrisense-frontend

# Install dependencies
npm install
```

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🌐 Development Server

The application runs on `http://localhost:3000` by default.

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url
VITE_WS_URL=your_websocket_url
```

## 🏛️ Architecture

### User Features
- Dashboard with device overview
- Real-time tracking map
- Alert management
- Geofence configuration
- Payment & subscription management
- Profile settings

### Admin Features
- Global tracking dashboard
- User management
- Device/tracker management
- Subscription management
- Analytics & reports
- System monitoring

## 🔐 Authentication

The application uses JWT-based authentication with route guards for user and admin access.

## 📱 Responsive Design

Fully responsive interface optimized for:
- Desktop browsers
- Tablets
- Mobile devices

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software.

## 👥 Team

Built with ❤️ by the AfriSense team

## 📞 Support

For support, email support@afrisense.com or open an issue in the repository.

---

**Day 0** - Project Foundation Complete 🎉
