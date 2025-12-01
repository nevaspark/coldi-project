const channels = {
  admin: new Set(), 
};
function getChannel(tenantId) {
  if (!channels[tenantId]) channels[tenantId] = new Set();
  return channels[tenantId];
}

export function subscribe(res, tenantId=null) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });
  res.write(': connected\n\n');
  const set = tenantId ? getChannel(tenantId) : channels.admin;
  set.add(res);
  res.on('close', () => {
    set.delete(res);
    res.end();
  });
}

function emitTo(set, event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of set) {
    try { res.write(payload); } catch {}
  }
}

export function publishTenant(tenantId, event, data) {
  const set = getChannel(tenantId);
  emitTo(set, event, data);
}

export function publishAdmin(event, data) {
  emitTo(channels.admin, event, data);
}
