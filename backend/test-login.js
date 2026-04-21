fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@credimatch.com', password: 'password' })
})
  .then(r => r.json())
  .then(d => {
    if (d.token) {
      console.log('✅ LOGIN SUCCESS');
      console.log('User:', JSON.stringify(d.user));
      console.log('Token (first 30 chars):', d.token.substring(0, 30) + '...');
    } else {
      console.log('❌ LOGIN FAILED:', JSON.stringify(d));
    }
  })
  .catch(e => console.error('❌ NETWORK ERROR:', e.message));
