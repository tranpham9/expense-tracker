//TODO: Likely needs to be changed to TypeScript
//NOTE: 'token_data' is different from 'user_data'. Here 'token_data' is used to
//store the JWT. 'user_data' will be used to store information like '_id' and other
//non-confidential information.
//Store the JWT
exports.storeToken = function ( tok )
{
   try
   {
       localStorage.setItem('token_data', tok.accessToken);
   }
   catch(e)
   {
       console.log(e.message);
   }
}
//Retrieve the JWT
exports.retrieveToken = function ()
{
   var ud;
   try
   {
       ud = localStorage.getItem('token_data');
   }
   catch(e)
   {
       console.log(e.message);
   }
   return ud;
}