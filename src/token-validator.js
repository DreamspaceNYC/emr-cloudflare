async function validateToken(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isValid: false, token: null };
  }

  const token = authHeader.substring(7);
  try {
    const decoded = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(process.env.JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token format');

    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp < Date.now() / 1000) {
      return { isValid: false, token: null };
    }

    const signature = parts[2];
    const expectedSignature = await crypto.subtle.sign(
      { name: 'HMAC', hash: 'SHA-256' },
      decoded,
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
    );

    const valid = await crypto.subtle.timingSafeEqual(
      new Uint8Array(expectedSignature),
      new Uint8Array(signature)
    );

    return { isValid: valid, token: payload };
  } catch (error) {
    return { isValid: false, token: null };
  }
}

export { validateToken };
