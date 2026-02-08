import axios from 'axios';

export const proxyController = (path, target) => {
  return async (req, res) => {
    try {
      const fullPath = path + (req.url === '/' ? '' : req.url);
      const targetUrl = `${target}/api/auth${fullPath}`;
      console.log(`[Manual Proxy] ${req.method} ${req.url} → ${targetUrl}`);

      const response = await axios({
        method: req.method,
        url: targetUrl,
        data: req.body,
        headers: {
          ...req.headers,
          host: new URL(target).host, // Fix host header
        },
      });

      // Forward cookies if any
      if (response.headers['set-cookie']) {
        res.setHeader('set-cookie', response.headers['set-cookie']);
      }

      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('[Proxy Error]:', error.message);
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ error: 'Proxy failed' });
      }
    }
  };
};

export const proxyControllerNotes = (path, target) => {
  return async (req, res) => {
    try {
      const fullPath = path + (req.url === '/' ? '' : req.url);
      const targetUrl = `${target}/api${fullPath}`;
      console.log(`[Manual Proxy] ${req.method} ${req.url} → ${targetUrl}`);

      const response = await axios({
        method: req.method,
        url: targetUrl,
        data: req.body,
        headers: {
          ...req.headers,
          'x-user-id': req.userId,
          host: new URL(target).host,
        },
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('[Proxy Error]:', error.message);
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ error: 'Proxy failed' });
      }
    }
  };
};