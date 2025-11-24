# Frontend UI Examples

Enhance your PostAI frontend with these UI patterns.

## Basic Form with API Call

```html
<!DOCTYPE html>
<html>
<head>
  <title>PostAI</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; }
    input, button { padding: 10px; margin: 5px; width: 100%; }
    #result { margin-top: 20px; padding: 15px; background: #f0f0f0; }
  </style>
</head>
<body>
  <h1>PostAI Generator</h1>
  <form id="generateForm">
    <input type="text" id="prompt" placeholder="Enter your prompt">
    <button type="submit">Generate</button>
  </form>
  <div id="result"></div>

  <script src="config.js"></script>
  <script>
    document.getElementById('generateForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const prompt = document.getElementById('prompt').value;
      const resultDiv = document.getElementById('result');
      
      resultDiv.textContent = 'Loading...';
      
      try {
        const response = await fetch(BACKEND_URL + '/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        
        const data = await response.json();
        resultDiv.textContent = JSON.stringify(data, null, 2);
      } catch (error) {
        resultDiv.textContent = 'Error: ' + error.message;
      }
    });
  </script>
</body>
</html>
```

## Modern Card-Based UI

```html
<style>
  .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
  .card { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  .btn { background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; }
  .btn:hover { background: #0056b3; }
  .input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; margin: 10px 0; }
</style>

<div class="container">
  <div class="card">
    <h2>Generate Content</h2>
    <input type="text" class="input" id="input" placeholder="What would you like to generate?">
    <button class="btn" onclick="generate()">Generate</button>
  </div>
  <div class="card" id="output">Results will appear here...</div>
</div>
```

## Loading States

```javascript
function setLoading(isLoading) {
  const btn = document.querySelector('button');
  const output = document.getElementById('output');
  
  if (isLoading) {
    btn.disabled = true;
    btn.textContent = 'Generating...';
    output.textContent = '⏳ Please wait...';
  } else {
    btn.disabled = false;
    btn.textContent = 'Generate';
  }
}

async function generate() {
  setLoading(true);
  try {
    const response = await fetch(BACKEND_URL + '/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: document.getElementById('input').value })
    });
    const data = await response.json();
    document.getElementById('output').textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    document.getElementById('output').textContent = 'Error: ' + error.message;
  } finally {
    setLoading(false);
  }
}
```

## Multiple API Calls

```javascript
async function generateMultiple() {
  const prompts = ['prompt1', 'prompt2', 'prompt3'];
  
  // Sequential
  for (const prompt of prompts) {
    const response = await fetch(BACKEND_URL + '/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    console.log(data);
  }
  
  // Parallel
  const promises = prompts.map(prompt => 
    fetch(BACKEND_URL + '/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    }).then(r => r.json())
  );
  
  const results = await Promise.all(promises);
  console.log(results);
}
```

## Error Handling UI

```javascript
async function apiCall() {
  try {
    const response = await fetch(BACKEND_URL + '/api');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    displaySuccess(data);
  } catch (error) {
    displayError(error.message);
  }
}

function displaySuccess(data) {
  const div = document.getElementById('output');
  div.className = 'success';
  div.textContent = JSON.stringify(data, null, 2);
}

function displayError(message) {
  const div = document.getElementById('output');
  div.className = 'error';
  div.innerHTML = `
    <h3>Error</h3>
    <p>${message}</p>
    <button onclick="apiCall()">Retry</button>
  `;
}
```

## Responsive Design

```css
@media (max-width: 768px) {
  body { padding: 10px; }
  .container { max-width: 100%; }
  .card { margin: 10px 0; padding: 15px; }
  input, button { width: 100%; }
}
```

## Dark Mode

```css
:root {
  --bg-color: #ffffff;
  --text-color: #000000;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
}

body {
  background: var(--bg-color);
  color: var(--text-color);
  transition: background 0.3s, color 0.3s;
}
```

```javascript
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
}
```

## Real-time Updates

```javascript
// Polling
setInterval(async () => {
  const response = await fetch(BACKEND_URL + '/status');
  const data = await response.json();
  updateUI(data);
}, 5000); // Every 5 seconds

// WebSocket (if backend supports it)
const ws = new WebSocket('wss://your-backend.onrender.com');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateUI(data);
};
```

Use these patterns to build your UI!

