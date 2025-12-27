# Notion Project Tasks

A modern, responsive web application for managing and viewing tasks from a Notion database. Features real-time search, status filtering, and a beautiful light/dark mode interface.

![Notion Project Tasks](https://img.shields.io/badge/Notion-API-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)

## ✨ Features

- 🔍 **Real-time Search** - Search tasks by title as you type
- 🎯 **Status Filtering** - Filter tasks by status (Done, In progress, TO-DO)
- 🌓 **Light/Dark Mode** - Toggle between light and dark themes with persistent preference
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Client-side Filtering** - Fast, instant filtering without API calls
- 🎨 **Modern UI** - Clean, card-based layout with smooth animations
- 🔒 **Secure** - API token stored server-side, never exposed to frontend

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- A Notion account with API access
- A Notion database with tasks

### Installation

1. **Clone or download this repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Notion API**
   
   Open `server.js` and update the following:
   ```javascript
   const NOTION_DATABASE_ID = 'YOUR_DATABASE_ID';
   const NOTION_TOKEN = 'YOUR_NOTION_API_TOKEN';
   ```
   
   To get your Notion API token:
   - Go to [Notion Integrations](https://www.notion.so/my-integrations)
   - Create a new integration
   - Copy the "Internal Integration Token"
   
   To get your Database ID:
   - Open your Notion database in a browser
   - Copy the ID from the URL (the part after the last `/` and before `?`)

4. **Start the backend server**
   ```bash
   npm start
   ```
   
   The server will run on `http://localhost:3000`

5. **Open the frontend**
   
   Simply open `index.html` in your web browser, or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server
   ```
   
   Then navigate to `http://localhost:8000` (or the port you specified)

## 📁 Project Structure

```
Notion/
├── index.html          # Main HTML file
├── style.css          # Stylesheet with light/dark mode
├── script.js          # Frontend JavaScript logic
├── server.js          # Node.js Express proxy server
├── package.json       # Node.js dependencies
└── README.md         # This file
```

## 🎯 Usage

### Loading Tasks

1. Click the **"Load Tasks"** button to fetch tasks from your Notion database
2. Tasks will be displayed as cards with title and status

### Searching Tasks

- Type in the **search bar** to filter tasks by title
- Search is case-insensitive and updates in real-time
- Clear the search to show all tasks

### Filtering by Status

- Use the **status dropdown** to filter tasks by:
  - All Statuses (shows everything)
  - Done
  - In progress
  - TO-DO
- You can combine search and status filter together

### Theme Toggle

- Click the **theme toggle button** (🌙/☀️) in the header
- Your preference is automatically saved
- Theme persists across page reloads

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Fetch API** - For API communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web server framework
- **CORS** - Cross-Origin Resource Sharing
- **node-fetch** - HTTP client for Notion API

## 🔧 API Configuration

The application uses a proxy server to handle CORS issues and keep API tokens secure.

### Backend Endpoint

- **URL**: `http://localhost:3000/api/tasks`
- **Method**: GET
- **Response**: JSON array of Notion page objects

### Notion API

- **Base URL**: `https://api.notion.com/v1`
- **Database Query**: `POST /databases/{database_id}/query`
- **Version**: `2022-06-28`

## 📋 Notion Database Requirements

Your Notion database must have the following properties:

1. **Name** (Title property)
   - Type: `title`
   - Used for task titles

2. **Status** (Status property)
   - Type: `status`
   - Options: Done, In progress, TO-DO
   - Used for task status filtering

## 🎨 Customization

### Changing Colors

Edit CSS variables in `style.css`:

```css
:root {
    --accent-color: #667eea;  /* Primary color */
    --bg-container: #ffffff;   /* Container background */
    /* ... more variables */
}
```

### Adding More Status Options

1. Update the dropdown in `index.html`:
   ```html
   <option value="New Status">New Status</option>
   ```

2. Add CSS styling in `style.css`:
   ```css
   .status.New-Status {
       background: #your-color;
       color: #your-text-color;
   }
   ```

## 🐛 Troubleshooting

### Tasks not loading

- **Check server is running**: Ensure `node server.js` is running
- **Verify API token**: Check `server.js` has correct token
- **Check database ID**: Verify database ID matches your Notion database
- **Check browser console**: Look for error messages

### CORS errors

- Make sure the backend server is running on port 3000
- Verify CORS is enabled in `server.js`

### Status showing "No Status"

- Verify your Notion database has a Status property
- Check that Status property type is `status` (not `select`)
- Ensure tasks have status values assigned in Notion

### Theme not persisting

- Check browser localStorage is enabled
- Clear browser cache and try again

## 🔒 Security Notes

- **Never commit API tokens** to version control
- API token is stored only in `server.js` (backend)
- Frontend never directly accesses Notion API
- Consider using environment variables for production:
  ```javascript
  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  ```

## 📝 License

ISC License

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

## 📧 Support

For issues or questions, please check:
- [Notion API Documentation](https://developers.notion.com/)
- Browser console for error messages
- Server logs for backend issues

---

**Powered by Notion API** 🚀

