# Kolokwa TechGuild

## Description

Kolokwa TechGuild is a Liberian-born collective of developers, innovators, and builders dedicated to shaping the nation's digital future. Join us for Code & Cocktails and the upcoming KoloKwa DevFest.

This project is the web application for Kolokwa TechGuild, built with Next.js, TypeScript, and Tailwind CSS. It features a modern UI using Radix UI components, form handling with React Hook Form and Zod, and integrates with various APIs for authentication, analytics, and more.

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Forms**: React Hook Form with Zod validation
- **Database**: LibSQL (Turso)
- **Authentication**: JWT with bcrypt
- **Email**: Resend
- **Analytics**: Vercel Analytics
- **Other**: QR code generation, date handling, charts with Recharts

## Getting Started in Development Mode

### Prerequisites

- Node.js (version 18 or higher)
- Yarn package manager

### Installation

1. Clone the repository (if not already done):
   ```bash
   git clone git@github.com:xarrijorge/kolokwa.git
   cd kolokwa
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

### Running the Development Server

1. Start the development server:
   ```bash
   yarn dev
   ```

2. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Additional Scripts

- `yarn build`: Build the application for production
- `yarn start`: Start the production server
- `yarn lint`: Run ESLint for code linting

### Environment Variables

If the application requires environment variables (e.g., for database connection, API keys), create a `.env.local` file in the root directory and add the necessary variables. Refer to the codebase or documentation for specific requirements.

### Contributing

Contributions are welcome! Please follow the standard Git workflow: fork, branch, commit, pull request.

For more information, visit the [Kolokwa TechGuild website](https://kolokwa.dev) or join our community events.
