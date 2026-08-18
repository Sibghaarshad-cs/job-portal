# Job Portal

A full-stack job portal web application built with **Next.js, React, Prisma, PostgreSQL, and Tailwind CSS**. The platform connects job seekers with employers and provides features such as job searching, job applications, resume/CV analysis, employer job management, currency conversion, and an AI-powered job search assistant.

---

## 1. Project Overview

The Job Portal is designed to provide a complete recruitment platform where:

* Job seekers can create an account and browse available jobs.
* Users can search and filter jobs.
* Job seekers can apply for jobs and upload their CV/resume.
* Employers can create, update, view, and delete job postings.
* Employers can view applications submitted for their jobs.
* Uploaded CVs can be analyzed against the selected job.
* The system generates a CV compatibility score and detailed evaluation.
* Users can search for jobs using an AI-powered chatbot.
* Salary information can be displayed and compared in different currencies.
* Application status can be tracked throughout the recruitment process.

The application uses a modern full-stack architecture where the frontend, backend API routes, authentication logic, database access, and business logic are integrated into a Next.js application.

---

# 2. Technology Stack

## Frontend

* **Next.js** — React framework using the App Router
* **React** — UI development
* **Tailwind CSS** — Styling and responsive UI
* **JavaScript / JSX** — Application development

## Backend

* **Next.js API Routes** — Backend endpoints
* **Prisma ORM** — Database access and queries
* **PostgreSQL** — Relational database
* **Zod** — Request/input validation
* **bcrypt** — Password hashing

## AI / External Services

* **Groq API** — AI-powered job search chatbot and CV analysis
* **Exchange Rate API** — Currency conversion

## Development Tools

* **VS Code**
* **Git**
* **GitHub**
* **npm**

---

# 3. System Architecture

The application follows a full-stack Next.js architecture.

```text
                    ┌─────────────────────┐
                    │       User          │
                    │ Job Seeker /        │
                    │ Employer            │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Next.js UI       │
                    │ React Components    │
                    │ Tailwind CSS        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Next.js API       │
                    │     Routes          │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌────────────┐   ┌─────────────┐   ┌─────────────┐
       │  Prisma    │   │    Groq     │   │ Exchange    │
       │    ORM     │   │     AI      │   │ Rate API    │
       └─────┬──────┘   └─────────────┘   └─────────────┘
             │
             ▼
       ┌────────────┐
       │ PostgreSQL │
       │  Database  │
       └────────────┘
```

### Architecture Flow

The general request flow is:

```text
User
  ↓
Next.js / React UI
  ↓
API Route
  ↓
Validation / Business Logic
  ↓
Prisma ORM
  ↓
PostgreSQL
  ↓
Response
  ↓
React UI
```

For AI-based functionality:

```text
User
  ↓
Next.js API Route
  ↓
Groq API
  ↓
AI Response
  ↓
Application Logic
  ↓
Database / UI
```

---

# 4. Main Features

## 4.1 Authentication

The application provides user authentication with:

* Signup
* Login
* Password hashing
* Session handling using cookies
* User identification through the authenticated user ID
* Different application functionality for job seekers and employers

Passwords are hashed before being stored in the database.

---

## 4.2 Job Management

Employers can manage their job postings.

Supported operations include:

* Create a job
* View jobs
* Update a job
* Delete a job
* View applications submitted for a job

A job contains information such as:

* Job title
* Company name
* Location
* Company location
* Category
* Job type
* Description
* Requirements
* Minimum salary
* Maximum salary
* Salary currency
* Status
* Posting date

Supported job types include options such as:

* Full-Time
* Part-Time

---

## 4.3 Job Search

Users can browse available jobs and search for relevant opportunities.

The job search system can use information such as:

* Job title
* Location
* Company
* Category
* Job type
* Salary range

The system also supports searching through both company location and job location where applicable.

---

# 5. AI Job Search Assistant

The application contains an AI-powered job search chatbot.

The chatbot allows users to describe the type of job they are looking for using natural language.

For example:

```text
Find me a full-time frontend developer job in Islamabad.
```

The system sends the user's message to Groq and converts the natural-language request into structured search filters.

The AI response can contain fields such as:

```text
isJobSearch
title
location
companyName
category
jobType
salaryMin
salaryMax
```

The structured information is then used by the job search system to find matching jobs.

### Chatbot Flow

```text
User message
     ↓
Job Assistant
     ↓
Groq AI
     ↓
Structured search filters
     ↓
Job database search
     ↓
Matching jobs
     ↓
Job cards
```

---

# 6. Job Applications

Job seekers can apply for available jobs.

During the application process, the user can provide application information and upload a resume/CV.

The application is associated with:

* The applicant
* The selected job
* Uploaded resume
* Application status
* CV analysis information

The application status can be:

```text
APPLIED
INTERVIEW
ACCEPTED
REJECTED
```

---

# 7. CV / Resume Analysis

One of the major features of the application is CV analysis.

The purpose of this feature is to compare a candidate's CV against the requirements of the job they are applying for.

### CV Analysis Flow

```text
Candidate applies
       ↓
Resume uploaded
       ↓
Resume PDF processed
       ↓
CV text extracted
       ↓
Job description retrieved
       ↓
Job requirements retrieved
       ↓
CV + Job information sent to Groq
       ↓
AI generates evaluation
       ↓
Scores and analysis saved
       ↓
Application displays CV Score
       ↓
Candidate / Employer can view evaluation
```

The analysis evaluates areas such as:

* Education
* Experience
* Skills
* Keywords / job relevance

The stored analysis can contain information such as:

```text
educationScore
educationText
experienceScore
experienceText
skillsScore
skills
keywordScore
keywordText
```

A combined CV score is also stored with the application.

For example:

```text
CV Score: 85%
```

This allows employers to quickly understand how closely an applicant's resume matches the job requirements.

---

# 8. Application Evaluation

Each application can have a dedicated detail/evaluation view.

The application detail page can show:

* Applicant information
* Job information
* Resume
* CV score
* Education evaluation
* Experience evaluation
* Skills evaluation
* Keyword/relevance evaluation
* Recommendations or analysis generated by the AI system

The Applications page provides a quick overview while the application detail page provides the complete evaluation.

---

# 9. Currency Conversion

The job portal supports multiple salary currencies.

Supported currencies include:

```text
PKR
USD
EUR
GBP
```

Job salary values are stored together with their original currency.

The application uses an exchange-rate API to convert salary values when users select a different currency.

For example:

```text
Database salary:
100,000 PKR

User selects:
USD

Displayed salary:
Converted USD value
```

The search system also considers currency conversion when applying salary filters.

For example, if a user searches for:

```text
Jobs above 100,000 USD
```

the system can convert stored job salaries to USD before comparing them with the requested salary range.

---

# 10. Database Architecture

The application uses **PostgreSQL** as its relational database and **Prisma** as the ORM.

The main entities include:

```text
User
  │
  ├─────────────── Jobs
  │
  └─────────────── Applications
                         │
                         └── Resume / CV Analysis
```

## User

The User table stores information related to registered users.

Important information includes:

* User ID
* Name
* Email
* Password
* Contact information
* User role
* Other account information

---

## Job

The Job model contains information about job postings.

Important fields include:

```text
id
userId
title
companyName
location
category
jobType
description
requirements
salaryMin
salaryMax
salaryCurrency
status
postedAt
companyLocation
```

The `userId` identifies the user/employer who created the job.

---

## Application

The Application model connects a job seeker with a job.

It stores information such as:

```text
id
jobId
userId
resume
status
cvScore
cvAnalysis
```

The `cvScore` stores the overall CV compatibility score.

The `cvAnalysis` field stores the detailed AI-generated evaluation.

---

# 11. API Architecture

The application uses Next.js API routes for backend functionality.

The main API structure is organized as follows:

```text
app/
└── api/
    ├── jobs/
    │   └── route.js
    │
    └── employer/
        └── jobs/
            ├── route.js
            │
            └── [id]/
                └── route.js
```

## Public Jobs API

```text
/api/jobs
```

Used for retrieving available jobs for users.

---

## Employer Jobs API

```text
/api/employer/jobs
```

Used for employer-related job operations such as:

* Getting employer jobs
* Creating a new job

---

## Individual Employer Job API

```text
/api/employer/jobs/[id]
```

Used for operations on a specific job:

* GET
* PATCH
* DELETE

The API identifies the logged-in user through the session cookie and uses the associated user ID when accessing user-specific data.

---

# 12. Authentication Flow

The application uses cookies to maintain the logged-in user's session.

The general flow is:

```text
Signup
  ↓
Password validation
  ↓
Password hashing
  ↓
User stored in PostgreSQL
  ↓
Login
  ↓
Credentials verified
  ↓
User ID stored in cookie
  ↓
Protected API routes read cookie
  ↓
User-specific data retrieved
```

Server-side API routes use the cookie to identify the current user.

---

# 13. Project Structure

The project follows the Next.js App Router structure.

A simplified structure is:

```text
job-portal/
│
├── app/
│   ├── api/
│   │   ├── jobs/
│   │   └── employer/
│   │
│   ├── jobs/
│   ├── applications/
│   ├── employer/
│   └── ...
│
├── components/
│   ├── landing/
│   ├── common/
│   └── ...
│
├── data/
│   └── landingData.js
│
├── lib/
│   └── ...
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── public/
│   ├── images/
│   └── icons/
│
├── .env
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

The exact contents may change as additional components and API routes are added, but the application follows this overall separation of concerns.

---

# 14. Prerequisites

Before running the project, install the following:

* Node.js
* npm
* PostgreSQL
* Git

A PostgreSQL database must be available before running the application.

---

# 15. Installation

Clone the repository:

```bash
git clone <repository-url>
```

Move into the project directory:

```bash
cd job-portal
```

Install dependencies:

```bash
npm install
```

---

# 16. Environment Variables

Create a `.env` file in the root directory.

Example:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/job_portal"

GROQ_API_KEY="your_groq_api_key"
```

### DATABASE_URL

This is the connection string for the PostgreSQL database.

Example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/job_portal"
```

Replace the username, password, and database name with the values from your PostgreSQL installation.

### GROQ_API_KEY

The Groq API key is required for AI functionality such as:

* Job search chatbot
* CV analysis

Do not commit the `.env` file or API keys to GitHub.

---

# 17. Database Setup

After installing the dependencies and configuring the database, run:

```bash
npx prisma generate
```

Then apply the Prisma migrations:

```bash
npx prisma migrate dev
```

This creates/updates the required PostgreSQL tables according to the Prisma schema.

If Prisma needs to be regenerated after schema changes:

```bash
npx prisma generate
```

---

# 18. Running the Application

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

Open the address in a web browser.

---

# 19. Production Build

To create a production build:

```bash
npm run build
```

After the build completes, start the production server with:

```bash
npm start
```

---

# 20. Development Workflow

A typical development workflow is:

```text
1. Update React / Next.js components
        ↓
2. Create or update API routes
        ↓
3. Update Prisma schema if database changes are required
        ↓
4. Create a Prisma migration
        ↓
5. Test the API
        ↓
6. Test the UI
        ↓
7. Commit changes with Git
        ↓
8. Push changes to GitHub
```

When changing the Prisma schema, use:

```bash
npx prisma migrate dev --name <migration-name>
```

For example:

```bash
npx prisma migrate dev --name add_cv_analysis
```

---

# 21. Important Data Flow Examples

## Creating a Job

```text
Employer
   ↓
Create Job Form
   ↓
POST /api/employer/jobs
   ↓
Validate input
   ↓
Get logged-in user
   ↓
Prisma
   ↓
PostgreSQL
   ↓
Job created
   ↓
Updated UI
```

## Applying for a Job

```text
Job Seeker
   ↓
Job Details
   ↓
Apply
   ↓
Resume/Application data
   ↓
Application API
   ↓
Application stored
   ↓
CV analysis
   ↓
CV score + analysis stored
   ↓
Application page
```

## Searching With the AI Assistant

```text
User
   ↓
Natural-language query
   ↓
Groq
   ↓
Structured filters
   ↓
Jobs API / database
   ↓
Matching jobs
```

---

# 22. Security Considerations

The application includes several basic security practices:

* Passwords are hashed before storage.
* API keys are stored in environment variables.
* Database access is handled through Prisma.
* User-specific resources are associated with authenticated user IDs.
* Input validation is performed using Zod where applicable.
* Sensitive environment variables are not included in source control.

The `.env` file should remain private and should be included in `.gitignore`.

---

# 23. Git and GitHub

The project uses Git for version control.

Basic commands:

```bash
git status
```

```bash
git add .
```

```bash
git commit -m "Your commit message"
```

```bash
git push
```

If the main branch has no upstream branch yet:

```bash
git push --set-upstream origin main
```

---

# 24. Future Improvements

Possible future improvements include:

* Email notifications for application updates
* More advanced employer dashboards
* Interview scheduling
* Candidate recommendation systems
* More detailed CV analytics
* Job recommendation based on user activity
* Advanced search filters
* Improved authentication and authorization
* Production deployment and monitoring

---

# 25. Conclusion

This Job Portal demonstrates a complete full-stack web application using modern web technologies.

The project combines:

* Next.js and React for the user interface
* Tailwind CSS for responsive design
* Next.js API routes for backend functionality
* Prisma for database management
* PostgreSQL for persistent data storage
* Secure password hashing for authentication
* Groq AI for intelligent job searching and CV analysis
* Exchange-rate services for multi-currency salary support

The architecture separates the user interface, API layer, business logic, database layer, and external services, making the application easier to maintain and extend.

---

## Author

**Job Portal Project**

Built as a full-stack web development project using Next.js, React, Prisma, PostgreSQL, Tailwind CSS, and AI-powered services.
