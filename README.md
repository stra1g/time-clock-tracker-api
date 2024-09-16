# NestJS Time Record API

## Description

This project is a NestJS-based API for time record management.

## Prerequisites

- Node.js 20 or greater
- Docker and Docker Compose
- npm or pnpm

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   pnpm install
   ```
3. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
4. Make the database initialization script executable:
   ```bash
   chmod +x init-multiple-databases.sh
   ```

## Running the Application

1. Start the Docker containers:
   ```bash
   docker-compose up -d
   ```
   or
   ```bash
   docker compose up -d
   ```
2. Pull the database schema:
   ```bash
   npx prisma db pull
   ```

The application is now running and can be accessed on port 8000 of your machine.

## Development
