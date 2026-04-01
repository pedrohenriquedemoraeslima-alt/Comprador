const body = typeof req.body === 'string'
  ? JSON.parse(req.body)
  : req.body;

const { plan } = body;
