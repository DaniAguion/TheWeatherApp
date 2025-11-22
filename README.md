# TheWeatherApp ☀️

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success.svg" />
  <img src="https://img.shields.io/badge/platform-Android%20%7C%20iOS-green.svg" />
  <img src="https://img.shields.io/badge/TypeScript-100%25-blue.svg" />
  <img src="https://img.shields.io/badge/React%20Native-0.78-61DAFB.svg" />
  <img src="https://img.shields.io/badge/cross--platform-multiplatform-orange.svg" />
</p>

## 🌤️ About

**TheWeatherApp** is a cross-platform mobile application built with React Native that delivers accurate, real-time weather information with an elegant and intuitive interface. Developed as part of a cross-platform development course, this app showcases modern mobile architecture patterns including clean architecture principles, efficient state management, and seamless API integration across both Android and iOS platforms.

---

## 📸 Screenshots
| Main Screen (iOS) | Hourly Forecast (iOS) | Weekly Forecast (iOS) | Saved Screen (iOS) |
|:-----:|:-----:|:------:|:-----------:|
| <img src="https://github.com/user-attachments/assets/d917b415-0ee6-489b-975f-c0ce0baf2161" width="180"/> | <img src="https://github.com/user-attachments/assets/099f7e32-92d0-435c-b218-d5f51d8cc97d" width="180"/> | <img src="https://github.com/user-attachments/assets/234a3493-66f0-4d74-b86c-56eef79819f8" width="180"/> | <img src="https://github.com/user-attachments/assets/832af2a1-f851-47b4-86fc-aad67c48105a" width="180"/> |
| Permissions (iOS) | Permissions (Android) | Main Screen (Android) | Explore Screen (Android) |
| <img src="https://github.com/user-attachments/assets/3fb887ba-00d2-4cdb-8018-e5e3be007541" width="180"/> | <img src="https://github.com/user-attachments/assets/b803e553-264d-4a56-8306-979812347573" width="180"/> | <img src="https://github.com/user-attachments/assets/de5d1a63-da81-4222-83b3-49dd0458baff" width="180"/> | <img src="https://github.com/user-attachments/assets/f3ad688e-e4a3-48e4-91cc-42c36bcf60ec" width="180"/> |


## ✨ Key Features

- **Current Location Weather** - View real-time forecast based on your current GPS location
- **Location Search** - Search for any location worldwide to check its weather forecast
- **Detailed Forecasts** - Hourly updates and comprehensive 7-day weather predictions
- **Favorite Locations** - Save and manage favorite locations for quick access
- **Custom Locations** - Add and store custom locations for easy reference
- **Rich Weather Data** - Temperature, conditions, hourly breakdowns, and weekly forecasts
- **Persistent Preferences** - Cached data and saved settings with AsyncStorage
- **Cross-Platform** - Single React Native codebase for both Android and iOS

---

## 🏗️ Technical Stack

### Frontend
- React Native 0.78 + TypeScript
- Component-based architecture
- Custom hooks for reusable logic
- Tab and stack navigation (React Navigation)

### Data & State Management
- AsyncStorage for client-side caching and persisted preferences
- DTO (Data Transfer Objects) for clean data mapping
- Dependency injection pattern for modular design

### Backend & APIs
- Open-Meteo Forecast API for weather data
- Open-Meteo Geocoding API for location search
- Native modules for geolocation services

### Architecture
```
src/
├── AppNavigator.tsx     # Navigation graph (tabs + stack)
├── data/                # API clients, caching helpers, DTO mappers
├── di/                  # Dependency injection container/provider
├── domain/              # Entities, ports, error/result helpers
├── hooks/               # Reusable hooks (geolocation wrapper)
└── presentation/        # Feature screens and view models
```

---

## 🌍 App Flow

1. **Launch** - Request location permission or select a saved favorite
2. **Current Weather** - View real-time conditions for current/selected location
3. **Hourly Details** - Explore hour-by-hour weather updates
4. **7-Day Forecast** - Check the week ahead with detailed predictions
5. **Search & Save** - Find locations worldwide and add them to favorites

---

## 📱 Requirements

### Android
- Android 8.0+ (API 26)
- Internet connection for live data
- Location permissions (optional)

### iOS
- iOS 13.0+
- Internet connection for live data
- Location permissions (optional)

### Development
- Node.js 16+
- React Native CLI 0.78
- CocoaPods (for iOS)
- Android Studio / Xcode
