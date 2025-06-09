
## Project Structure

```
├── server.js              # Server entry point
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── .env.example           # Example environment file
├── .gitignore            # Git ignore rules
├── README.md             # Project documentation
│
├── src/                   # Source code
│   ├── config/           # Configuration files
│   │   ├── database.js
│   │   └── config.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── controllers/      # Route controllers
│   │   ├── index.js
│   │   └── userController.js
│   ├── routes/           # Route definitions
│   │   ├── index.js
│   │   └── userRoutes.js
│   ├── models/           # Data models
│       └── User.js
│   
│   
│   
│       
│
├── public/               # Static files
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript files
│   ├── images/          # Image assets
│   ├── fonts/           # Font files
│   ├── uploads/         # User uploads
│   └── uploads/         # User uploads
│
├── views/                # Template files
│   ├── pages/           # Page templates
│   ├── partials/        # Reusable components
│   ├── layouts/         # Layout templates
│   └── components/      # Custom components
```