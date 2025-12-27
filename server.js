const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Notion API Configuration
const NOTION_API_BASE = 'https://api.notion.com/v1';
const NOTION_DATABASE_ID = '2cfe80087f5f80a696bde412935dd26b';
const NOTION_VERSION = '2022-06-28';
const NOTION_TOKEN = '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';

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

/**
 * Proxy endpoint to fetch tasks from Notion API
 * GET /api/tasks
 */
app.get('/api/tasks', async (req, res) => {
    try {
        // Call Notion API
        const response = await fetch(
            `${NOTION_API_BASE}/databases/${NOTION_DATABASE_ID}/query`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${NOTION_TOKEN}`,
                    'Notion-Version': NOTION_VERSION,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    page_size: 100
                })
            }
        );

        // Handle Notion API errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 401) {
                return res.status(401).json({
                    error: 'Authentication failed. Please check your API token.'
                });
            }
            
            if (response.status === 403) {
                return res.status(403).json({
                    error: 'Access forbidden. Please verify your token has the correct permissions.'
                });
            }
            
            return res.status(response.status).json({
                error: errorData.message || `API request failed with status ${response.status}`
            });
        }

        // Parse and return data
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        // Handle network or other errors
        console.error('Proxy error:', error);
        res.status(500).json({
            error: 'Internal server error. Please try again later.'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/tasks`);
});

