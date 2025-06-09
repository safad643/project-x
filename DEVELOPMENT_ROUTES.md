# SubSplit Development Routes

This document explains how to use the development-only routes for UI testing and preview.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   The server will start on `http://localhost:3000`

## Available Development Routes

These routes are specifically designed for UI testing and development. They serve static HTML files directly without any backend processing.

### Main Pages

| Route | Description | File Served |
|-------|-------------|-------------|
| `/` | Redirects to homepage | `views/pages/homepage.html` |
| `/homepage-view` | Homepage | `views/pages/homepage.html` |
| `/index-view` | Login/Register page | `views/pages/index.html` |
| `/rooms-view` | Available rooms | `views/pages/rooms.html` |
| `/subscriptions-view` | User subscriptions | `views/pages/subscriptions.html` |
| `/profile-view` | User profile | `views/pages/profile.html` |
| `/contact-view` | Contact page | `views/pages/contact.html` |

## File Structure

```
views/
├── pages/
│   ├── homepage.html      # Main landing page
│   ├── index.html         # Login/Register page
│   ├── rooms.html         # Available rooms
│   ├── subscriptions.html # User subscriptions
│   ├── profile.html       # User profile
│   ├── contact.html       # Contact form
│   └── 404.html          # Error page
├── partials/              # Reusable components
├── layouts/               # Page layouts
└── components/            # UI components
```

## Notes

- These routes are **development-only** and should not be used in production
- All pages use the same CSS and JavaScript files for consistency
- The server automatically serves static assets from the `public/` directory
- Images are served from the `images/` directory
- All routes follow the pattern `/pagename-view` for easy identification

## Troubleshooting

If you encounter issues:

1. **Check if server is running:** `npm run dev`
2. **Verify port availability:** Default port is 3000
3. **Check file paths:** Ensure HTML files exist in `views/pages/`
4. **Check console:** Look for any error messages in the terminal
5. **Test with curl:** Use curl to test routes directly

## Next Steps

Once UI testing is complete, these development routes can be replaced with proper backend routes that include:
- Database integration
- User authentication
- Dynamic content rendering
- API endpoints
- Form processing 