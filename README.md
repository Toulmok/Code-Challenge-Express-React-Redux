# code-challenge-react
 
Replace CLIENT_ID in 'server.env' with your app ID.  Change redirect to 'http://localhost:9000/authenticate'.

Build React App in client dir using 'npm run build'.
Start Express Server in root dir using 'npm start'.

Client interface uses the model from Esri's React-Redux repository from 'https://github.com/Esri/react-redux-js4'.

ExpressJS server uses the model from the Medium article 'https://medium.com/geekculture/build-and-deploy-a-web-application-with-react-and-node-js-express-bce2c3cfec32' by Leandro Ercoli with a repository at 'https://github.com/leandroercoli/NodeReact'.  

This app uses the server-enabled OAuth2 workflow from 'https://developers.arcgis.com/arcgis-rest-js/authentication/tutorials/authenticate-with-an-arcgis-identity-rest-js-server/' and the Esri demo from 'https://github.com/Esri/arcgis-rest-js/blob/main/demos/express-oauth-advanced/' .