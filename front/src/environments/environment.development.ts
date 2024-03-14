export const environment = {
    apiUrl: location.origin,
    wsUrl: location.origin.replace('4200','8000').replace('http','ws')+'/ws/:room/:user' 
};
