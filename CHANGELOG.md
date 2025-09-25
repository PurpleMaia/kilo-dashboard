# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# [Unreleased]

## [2.1.0] - 2025-09-17
### Added
- Desktop View Configurations for UI/UX

### Fixed
- Bug where new uploaded data would map incorrectly to each zone

## [2.0.0] - 2025-08-25
### Added
- Kilo Form input (text-based), displays most recent Kilo on main dashboard
- (not available to public) Kilo LLM code (fullstack), need to store conversations
- Drawer Navigation

### Removed
- CustomGPT

## [1.2.0] - 2025-08-18
### Added
- Ability to query public data APIs (USGS for water sensing, EPA for UV) with hardcoded location to Waimanālo.
- Utilized `refetch` from Tanstack Query on those api calls (retriggers the GET API every 5 minutes) 

### Fixed
- Bug where logging out triggered unnecessary redirects

## [1.1.0] - 2025-08-15
### Added
- Progessive Web App Configuration
- UI/UX Rework
- React Query Cacheing
- Authentication Guards

### Fixed
- Overall scroll feel to app
- Bug where signing out would keep you in another person's session
- Bug where sensor readings would render in ALL data (regardless of aina), handle error gracefully

### Optimized
- DB queries for userID & ainaID

## [1.0.0] - 2025-07-15 (Beta Release)
### Added
- APIs for Custom GPT configuration
- Export Data function

## [0.4.0] - 2025-07-08
### Added
- Graph Visualization change to Recharts
- Home/Dashboard Page Layout with Widget Components

### Fixed
- CSV editor bugs and CSV uploader bugs

## [0.3.0] - 2025-07-03
### Added
- User Registration
- Profile Page
- Sensor Page & Samples Page

## [0.2.0] – 2025-06-30
### Added
- CSV Editor
- CSV Uploader
- Weather API

## [0.1.1] - 2025-06-10
- Refactored RedwoodJS version from Hackathon to Next.js

## [0.1.0] – 2025-06-05
### Added
- Project scaffolding
- Basic Next.js frontend
- Initial database migrations
