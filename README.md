# TheWeatherApp

Weather App develop with React Native for the cross-platform course.

## Features
- View the current weather forecast based on your current location or a saved favorite location.
- Explore a detailed weather screen with hourly updates and a 7-day forecast.
- Search for any location worldwide to check its forecast.
- Save favorite and custom locations for quick and easy access.


## Tech Stack
- React Native 0.78.
- AsyncStorage for client side cache and persisted preferences.
- Open-Meteo Forecast and Geocoding APIs for weather and location data.
- Native modules to get the current location.


## Project Structure
```
src/
  AppNavigator.tsx      # Navigation graph (tabs + stack)
  data/                 # API clients, caching helpers, DTO mappers
  di/                   # Simple dependency injection container/provider
  domain/               # Entities, ports, and error/result helpers
  hooks/                # Reusable hooks (e.g. geolocation wrapper)
  presentation/         # Feature screens and their view models
```