function basicAuth(username: string, password: string): { Authorization: string } {
  const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');
  return {
      Authorization: `Basic ${base64Credentials}` as string
  };
}
  
  export default basicAuth;
  