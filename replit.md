# EcoPulse - Smart Green Commute Tracker

## Overview

EcoPulse is a Progressive Web App (PWA) designed to promote sustainable commuting by allowing users to log daily travel, calculate CO₂ savings, and track their environmental impact through real-time leaderboards and dashboards. The application enables users to record various commute modes (walking, biking, public transport, car, etc.), measure their carbon footprint reduction compared to car travel, and compete with others in reducing environmental impact.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Cross-Platform Architecture
The application uses a hybrid architecture supporting both React Native (mobile) and React web platforms:
- **React Native** for mobile apps using Expo Router for navigation
- **React web** using React Router for web deployment
- **Shared components and logic** between platforms with platform-specific implementations

### State Management
- **Zustand** for lightweight global state management
- **TanStack Query (React Query)** for server state management, caching, and data synchronization
- **Context API** for app-wide user and settings management

### Data Storage
- **AsyncStorage** for React Native mobile persistence
- **LocalStorage** for web browser persistence
- **Storage abstraction layer** that provides consistent API across platforms
- **No backend database** - all data stored locally on device/browser

### Frontend Architecture
- **Component-based architecture** with shared UI components
- **File-based routing** using Expo Router for mobile and React Router for web
- **TypeScript** for type safety and better developer experience
- **Responsive design** principles for cross-device compatibility

### Data Models
Key data structures include:
- **User**: Profile information with optional anonymization
- **CommuteLog**: Trip records with modes, distance, time, and calculated CO₂ savings
- **CommunityStats**: Aggregated statistics for leaderboards and community features
- **LeaderboardEntry**: User rankings based on environmental impact

### Business Logic
- **CO₂ calculation engine** that compares user's transport choices against car baseline
- **Leaderboard system** with time-based filtering (daily, weekly, all-time)
- **Progress tracking** with personal goals and achievement systems
- **Anonymous user support** for privacy-conscious users

## External Dependencies

### Core Frameworks
- **React/React Native** - UI framework for cross-platform development
- **Expo** - React Native development platform with managed workflow
- **Vite** - Build tool and development server for web version

### UI and Graphics
- **Lucide React/React Native** - Icon library with consistent iconography
- **React Native SVG** - SVG rendering for mobile
- **Expo Linear Gradient** - Gradient backgrounds and visual effects

### Navigation and Routing
- **Expo Router** - File-based routing for React Native
- **React Router DOM** - Client-side routing for web version
- **React Navigation** - Additional navigation utilities

### Developer Tools
- **TypeScript** - Static type checking and enhanced IDE support
- **NativeWind** - Tailwind CSS-like styling for React Native (configured but not heavily used)

### Platform-Specific Features
- **React Native Gesture Handler** - Touch gesture recognition
- **React Native Safe Area Context** - Safe area handling for mobile devices
- **React Native Screens** - Native screen optimization
- **Expo modules** for camera, location, fonts, and system UI integration