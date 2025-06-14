# Portfolio-api

A RESTful API backend for managing and showcasing personal portfolio data. This project is built to help developers and professionals easily serve, update, and organize their portfolio content—such as projects, skills, experiences, and contact information—via a clean and secure API.

## Features

- **Project Management**: Add, edit, and delete project entries.
- **Skills & Experience**: Organize skills and professional experience for easy retrieval.
- **Contact APIs**: Endpoints for visitor contact or inquiry.
- **Extensible**: Easily add new sections (blogs, testimonials, etc.) as needed.
- **RESTful Design**: Follows REST principles for clear and predictable endpoints.

## Technologies Used

- **Node.js** with **Express.js** – Fast, minimalist web framework
- **MongoDB** (with Mongoose) – NoSQL database for flexible data structures
- **dotenv** – Environment variable management

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

```bash
git clone https://github.com/vishantvelip/Portfolio-api.git
cd Portfolio-api
npm install
# or
yarn install
```

### Configuration

Copy the example environment file and fill in your secrets:

```bash
cp .env.example .env
```

Edit `.env` to include your MongoDB URI, JWT secret, and any other required config.

### Running the Server

```bash
npm start
# or
yarn start
```

The server will start on the port specified in your `.env` file (default: `3000`).

### API Endpoints Overview

- `GET /api/projects` — List all projects
- `POST /api/projects` — Add new project (protected)
- `PUT /api/projects/:id` — Update project (protected)
- `DELETE /api/projects/:id` — Delete project (protected)
- `GET /api/skills` — List all skills
- `GET /api/experience` — List experience entries
- `POST /api/contact` — Submit a contact form


```
Authorization: Bearer <your-token>
```

See the `/api/auth/login` endpoint for obtaining a token.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a new Pull Request

## License

[MIT](./LICENSE)

---

> Maintained by [vishantvelip](https://github.com/vishantvelip).  
> Feel free to open issues or pull requests for suggestions and improvements!
