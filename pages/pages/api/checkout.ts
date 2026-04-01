const body = typeof req.body === 'string'
  ? JSON.parse(req.body)
  : req.body;

const { plan } = body;
export const config = {
  runtime: 'nodejs'
};
