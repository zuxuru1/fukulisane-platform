diff --git a/package.json b/package.json
new file mode 100644
index 0000000..e69de29
--- /dev/null
+++ b/package.json
@@ -0,0 +1,37 @@
+{
+  "name": "weather-dashboard",
+  "version": "1.0.0",
+  "description": "Simple weather dashboard using Open-Meteo and Nominatim",
+  "type": "module",
+  "main": "server/index.js",
+  "scripts": {
+    "start": "node server/index.js",
+    "dev": "NODE_ENV=development node server/index.js"
+  },
+  "dependencies": {
+    "express": "^4.18.2",
+    "node-cache": "^5.1.2",
+    "node-fetch": "^3.3.2",
+    "cors": "^2.8.5"
+  },
+  "engines": {
+    "node": ">=18"
+  }
+}
diff --git a/server/index.js b/server/index.js
new file mode 100644
index 0000000..e69de29
--- /dev/null
+++ b/server/index.js
@@ -0,0 +1,153 @@
+// server/index.js
+// Simple Express server that proxies geocoding (Nominatim) and weather (Open-Meteo)
+// and serves static frontend in /public
+
+import express from 'express';
+import NodeCache from 'node-cache';
+import fetch from 'node-fetch';
+import path from 'path';
+import { fileURLToPath } from 'url';
+import cors from 'cors';
+
+const __filename = fileURLToPath(import.meta.url);
+const __dirname = path.dirname(__filename);
+
+const app = express();
+const cache = new NodeCache({ stdTTL: 300 }); // 5 minute cache
+
+app.use(express.json());
+app.use(cors());
+app.use(express.static(path.join(__dirname, '..', 'public')));
+
+// Helper: fetch with timeout
+async function fetchWithTimeout(url, opts = {}, timeout = 8000) {
+  const controller = new AbortController();
+  const id = setTimeout(() => controller.abort(), timeout);
+  try {
+    const res = await fetch(url, { signal: controller.signal, ...opts });
+    clearTimeout(id);
+    return res;
+  } catch (err) {
+    clearTimeout(id);
+    throw err;
+  }
+}
+
+// Helper: cached fetch JSON
+async function cachedFetchJson(cacheKey, url, opts = {}) {
+  const cached = cache.get(cacheKey);
+  if (cached) return cached;
+  const res = await fetchWithTimeout(url, opts, 9000);
+  if (!res.ok) {
+    const text = await res.text().catch(() => null);
+    throw new Error(`Upstream error ${res.status} ${res.statusText} ${text ? '- ' + text.slice(0,200) : ''}`);
+  }
+  // try parse JSON
+  const ct = res.headers.get('content-type') || '';
+  if (ct.includes('application/json')) {
+    const json = await res.json();
+    cache.set(cacheKey, json);
+    return json;
+  } else {
+    // fallback: return text wrapped in { text: '...' }
+    const text = await res.text();
+    const out = { text };
+    cache.set(cacheKey, out);
+    return out;
+  }
+}
+
+// Geocoding: Nominatim (OpenStreetMap)
+app.get('/api/geocode', async (req, res) => {
+  try {
+    const q = (req.query.q || '').trim();
+    if (!q) return res.status(400).json({ error: 'q query param required' });
+
+    const cacheKey = `geocode:${q.toLowerCase()}`;
+    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=8`;
+    const data = await cachedFetchJson(cacheKey, url, {
+      headers: { 'User-Agent': 'weather-dashboard/1.0 (contact: you@example.com)' }
+    });
+
+    // map to lighter response (if upstream returned JSON)
+    const mapped = Array.isArray(data)
+      ? data.map((d) => ({
+          display_name: d.display_name,
+          lat: d.lat,
+          lon: d.lon,
+          type: d.type,
+          class: d.class
+        }))
+      : [];
+    res.json(mapped);
+  } catch (err) {
+    console.error('geocode error', err);
+    res.status(500).json({ error: String(err) });
+  }
+});
+
+// Weather: Open-Meteo
+app.get('/api/weather', async (req, res) => {
+  try {
+    const lat = parseFloat(req.query.lat);
+    const lon = parseFloat(req.query.lon);
+    if (Number.isNaN(lat) || Number.isNaN(lon)) return res.status(400).json({ error: 'lat and lon required' });
+
+    const params = new URLSearchParams({
+      latitude: String(lat),
+      longitude: String(lon),
+      current_weather: 'true',
+      hourly: 'temperature_2m,relativehumidity_2m,apparent_temperature',
+      daily: 'weathercode,temperature_2m_max,temperature_2m_min',
+      timezone: 'auto'
+    });
+
+    const cacheKey = `weather:${lat.toFixed(4)}:${lon.toFixed(4)}`;
+    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
+
+    const data = await cachedFetchJson(cacheKey, url);
+    res.json(data);
+  } catch (err) {
+    console.error('weather error', err);
+    res.status(500).json({ error: String(err) });
+  }
+});
+
+// Fallback: serve index.html for SPA routes
+app.get('*', (req, res) => {
+  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
+});
+
+const port = process.env.PORT || 3000;
+app.listen(port, () => {
+  console.log(`Weather dashboard server running on http://localhost:${port}`);
+});
diff --git a/public/index.html b/public/index.html
new file mode 100644
index 0000000..e69de29
--- /dev/null
+++ b/public/index.html
@@ -0,0 +1,244 @@
+<!doctype html>
+<html>
+<head>
+  <meta charset="utf-8" />
+  <title>Weather Dashboard</title>
+  <meta name="viewport" content="width=device-width,initial-scale=1" />
+  <style>
+    body { font-family: system-ui, Roboto, Arial; max-width: 980px; margin: 24px auto; padding: 0 16px; }
+    h1 { margin-bottom: 6px; }
+    .search { display:flex; gap:8px; margin-bottom:12px; }
+    input[type="search"] { flex:1; padding:8px; font-size:16px; }
+    button { padding:8px 12px; }
+    .results { margin-top:12px; display:flex; gap:16px; align-items:flex-start; }
+    .card { background:#fff; border:1px solid #eee; padding:12px; border-radius:8px; box-shadow:0 1px 4px rgba(0,0,0,0.04); }
+    #suggestions { position:relative; }
+    ul.suggestions { position:absolute; left:0; right:0; background:white; list-style:none; margin:0; padding:6px; border:1px solid #ddd; max-height:200px; overflow:auto; z-index:10;}
+    ul.suggestions li { padding:8px; cursor:pointer; border-radius:4px; }
+    ul.suggestions li:hover { background:#f2f2f2; }
+    .forecast { display:flex; gap:8px; flex-wrap:wrap; margin-top:8px; }
+    .day { padding:8px; border-radius:6px; border:1px solid #eee; min-width:120px; }
+    canvas { max-width:100%; }
+    .small { font-size:0.9em; color:#666; }
+  </style>
+  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
+</head>
+<body>
+  <h1>Weather Dashboard</h1>
+  <p class="small">Search for a place (uses OpenStreetMap Nominatim) and fetch forecast from Open-Meteo (no API key).</p>
+
+  <div class="search">
+    <div style="flex:1; position:relative;">
+      <input id="q" type="search" placeholder="City, address, or place name" autocomplete="off"/>
+      <div id="suggestions"></div>
+    </div>
+    <button id="btnSearch">Search</button>
+  </div>
+
+  <div id="main" class="results" style="display:none;">
+    <div class="card" style="flex:1;">
+      <h2 id="place">—</h2>
+      <div id="current">
+        <p id="curSummary">Loading...</p>
+        <p class="small" id="coords"></p>
+      </div>
+      <div class="card small" id="extra" style="margin-top:8px;"></div>
+    </div>
+
+    <div class="card" style="flex:1;">
+      <h3>Hourly temperature</h3>
+      <canvas id="hourChart" height="200"></canvas>
+      <h3 style="margin-top:10px">7-day forecast</h3>
+      <div id="forecast" class="forecast"></div>
+    </div>
+  </div>
+
+  <script>
+    const qEl = document.getElementById('q');
+    const btn = document.getElementById('btnSearch');
+    const suggestionsEl = document.getElementById('suggestions');
+    let chart = null;
+
+    let selected = null;
+
+    async function geocode(q) {
+      if (!q) return [];
+      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
+      if (!res.ok) throw new Error('geocode failed');
+      return res.json();
+    }
+
+    async function fetchWeather(lat, lon) {
+      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
+      if (!res.ok) throw new Error('weather fetch failed');
+      return res.json();
+    }
+
+    let typingTimer;
+    qEl.addEventListener('input', () => {
+      clearTimeout(typingTimer);
+      const v = qEl.value.trim();
+      if (!v) { suggestionsEl.innerHTML = ''; return; }
+      typingTimer = setTimeout(async () => {
+        try {
+          const items = await geocode(v);
+          showSuggestions(items);
+        } catch (e) {
+          console.error(e);
+        }
+      }, 350);
+    });
+
+    function showSuggestions(items) {
+      if (!items || items.length === 0) { suggestionsEl.innerHTML = ''; return; }
+      const ul = document.createElement('ul');
+      ul.className = 'suggestions';
+      items.forEach(it => {
+        const li = document.createElement('li');
+        li.textContent = it.display_name;
+        li.onclick = () => {
+          selectPlace(it);
+          suggestionsEl.innerHTML = '';
+        };
+        ul.appendChild(li);
+      });
+      suggestionsEl.innerHTML = '';
+      suggestionsEl.appendChild(ul);
+    }
+
+    function selectPlace(place) {
+      selected = place;
+      qEl.value = place.display_name;
+      loadWeatherForSelected();
+    }
+
+    btn.addEventListener('click', async () => {
+      const q = qEl.value.trim();
+      if (!q) return;
+      try {
+        const items = await geocode(q);
+        if (items && items.length) {
+          selectPlace(items[0]);
+        } else {
+          alert('No places found');
+        }
+      } catch (e) {
+        alert('Search failed');
+      }
+    });
+
+    async function loadWeatherForSelected() {
+      if (!selected) return;
+      document.getElementById('main').style.display = 'flex';
+      document.getElementById('place').textContent = selected.display_name;
+      document.getElementById('coords').textContent = `lat ${selected.lat}, lon ${selected.lon}`;
+      document.getElementById('curSummary').textContent = 'Loading weather...';
+      try {
+        const data = await fetchWeather(selected.lat, selected.lon);
+        renderWeather(data);
+      } catch (e) {
+        document.getElementById('curSummary').textContent = 'Weather fetch failed';
+        console.error(e);
+      }
+    }
+
+    function renderWeather(data) {
+      // current_weather and hourly/daily data
+      const cur = data.current_weather;
+      const hourly = data.hourly || {};
+      const daily = data.daily || {};
+      document.getElementById('curSummary').innerHTML = `
+        <strong>${cur.temperature}°C</strong> — wind ${cur.windspeed} km/h, direction ${cur.winddirection}°
+        <div class="small">as of ${cur.time}</div>
+      `;
+      const extra = document.getElementById('extra');
+      extra.innerHTML = `
+        <div><strong>Humidity:</strong> ${hourly.relativehumidity_2m ? hourly.relativehumidity_2m[0] + '%' : 'n/a'}</div>
+        <div><strong>Apparent temp (hourly):</strong> ${hourly.apparent_temperature ? hourly.apparent_temperature[0] + '°C' : 'n/a'}</div>
+      `;
+
+      // Hourly chart (first 48 points)
+      const times = hourly.time ? hourly.time.slice(0, 48) : [];
+      const temps = hourly.temperature_2m ? hourly.temperature_2m.slice(0, 48) : [];
+      const ctx = document.getElementById('hourChart').getContext('2d');
+      if (chart) chart.destroy();
+      chart = new Chart(ctx, {
+        type: 'line',
+        data: {
+          labels: times,
+          datasets: [{
+            label: 'Temperature (°C)',
+            data: temps,
+            borderColor: 'rgb(75, 192, 192)',
+            tension: 0.2,
+            fill: false
+          }]
+        },
+        options: { scales: { x: { display: true, ticks: { maxRotation: 45, minRotation: 0 } } } }
+      });
+
+      // Daily forecast
+      const forecastEl = document.getElementById('forecast');
+      forecastEl.innerHTML = '';
+      if (daily.time && daily.time.length) {
+        for (let i = 0; i < daily.time.length; i++) {
+          const date = daily.time[i];
+          const tmax = daily.temperature_2m_max[i];
+          const tmin = daily.temperature_2m_min[i];
+          const code = daily.weathercode[i];
+          const div = document.createElement('div');
+          div.className = 'day';
+          div.innerHTML = `<div><strong>${date}</strong></div>
+                           <div class="small">Max ${tmax}°C · Min ${tmin}°C</div>
+                           <div class="small">code ${code}</div>`;
+          forecastEl.appendChild(div);
+        }
+      }
+    }
+  </script>
+</body>
+</html>
diff --git a/README.md b/README.md
new file mode 100644
index 0000000..e69de29
--- /dev/null
+++ b/README.md
@@ -0,0 +1,43 @@
+# Weather Dashboard (Open-Meteo + Nominatim)
+
+Quick local project that provides a simple weather dashboard:
+- Geocoding via Nominatim (OpenStreetMap) — no API key
+- Weather via Open-Meteo — no API key
+- Minimal Express backend with caching
+- Single-page frontend with Chart.js for hourly temperatures
+
+Run locally:
+1. Node 18+ recommended.
+2. Install:
+   npm install
+3. Start:
+   npm start
+4. Open http://localhost:3000
+
+Notes & improvements:
+- Respect Nominatim usage policy: provide a proper User-Agent and avoid heavy automated queries.
+- For production, add rate limiting, persistent caching (Redis), authentication, and API usage monitoring.
+- To add more parameters (wind, precipitation, solar, etc.) extend the Open-Meteo query params in server/index.js.
+- Add error UI and loading states on the frontend; support map integration and bookmarking places.
diff --git a/.gitignore b/.gitignore
new file mode 100644
index 0000000..e69de29
--- /dev/null
+++ b/.gitignore
@@ -0,0 +1,6 @@
+node_modules/
+.env
+.DS_Store
+npm-debug.log
+coverage/
+*.local
