export default  async function fetchWrapper (link, authRequired) {
    let accesToken;

    authRequired && (accesToken = localStorage.getItem('accessToken') || '');
  
    const response = await fetch(link, {
    method: "POST",
    credentials: "include",
    headers:{
        ...(accesToken && {'Authorization': accesToken ? `Bearer ${accesToken}` : ''}),
        'Content-Type': 'application/json',
    }
    }
    )
    
   return response;
   
    
  }