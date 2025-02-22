function basicAuth(username:String, password:String):{Authorization:String} {
    const sanitizedUsername = username.replace(/\r|\n/g, '');
    const sanitizedPassword = password.replace(/\r|\n/g, '');
    
    const token = Buffer.from(`${sanitizedUsername}:${sanitizedPassword}`).toString('base64');
    return {
      Authorization: `Basic ${token}`
    };
  }
  
  export default basicAuth;
  