async function logAccess(logsDB, request, token) {
  const entry = {
    timestamp: new Date().toISOString(),
    ip: request.headers.get('CF-Connecting-IP') || request.ip,
    userAgent: request.headers.get('user-agent'),
    tokenId: token?.tokenId,
    recordId: token?.recordId,
    action: 'access'
  };

  await logsDB.insert(entry);
}

export { logAccess };
