# AI-Assisted Wearable Insulin Delivery Research Prototype

## Project Type

Benchtop academic research prototype.

This project is intended for research, simulation, and demonstration purposes only. It is not a medical device and is not intended for clinical use or administration of insulin to humans.

## Architecture

User
↓
Android App
↓
Node.js / Express Backend
↓
Python AI Service + Database
↓
Application Validation
↓
ESP32-S3
↓
Embedded Safety Validation
↓
Safe Benchtop Output

## Technology Stack

- Mobile: React Native + Expo
- Backend: Node.js + Express
- AI Service: Python
- Database: SQL-based database
- Hardware: ESP32-S3 N16R8
- Firmware: PlatformIO + Arduino
- Communication: HTTP / JSON
- Device Networking: Wi-Fi + mDNS
- Development: VS Code + Android Studio
- Version Control: Git + GitHub

## Project Structure

- mobile-app/ - Android application
- backend/ - Node.js / Express backend
- ai-service/ - Python AI/advisory service
- firmware/ - ESP32 firmware
- database/ - Database-related files
- docs/ - Project documentation
- tests/ - Testing resources

## Safety Architecture

The AI component is advisory only.

Physical actuation must pass two independent validation layers:

1. Application-level validation
2. ESP32 embedded validation

The physical output remains a safe benchtop research/simulation output.

## Development Approach

The project is developed incrementally:

1. One page at a time
2. One feature at a time
3. Test each feature
4. Verify functionality
5. Commit tested changes
6. Use feature branches for meaningful development
7. Keep main stable
