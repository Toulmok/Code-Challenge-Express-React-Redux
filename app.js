//https://medium.com/geekculture/build-and-deploy-a-web-application-with-react-and-node-js-express-bce2c3cfec32
//https://github.com/leandroercoli/NodeReact

//https://stackoverflow.com/questions/72758122/auth0-flow-in-a-fullstack-system
//https://www.sitepoint.com/google-auth-react-express/
//https://developers.arcgis.com/documentation/mapping-apis-and-services/security/arcgis-identity/server-enabled-apps/
//https://developers.arcgis.com/arcgis-rest-js/authentication/tutorials/authenticate-with-an-arcgis-identity-rest-js-server/
//https://github.com/Esri/arcgis-rest-js/blob/master/demos/node-cli-item-management/index.js

//Cors
//https://javascript.info/fetch-crossorigin
//https://www.section.io/engineering-education/how-to-use-cors-in-nodejs-with-express/
import dotenv from 'dotenv'
dotenv.config({path:'./server/.env'})
import Server from './server/server.js'
const server = new Server()

server.listen()
/*eslint-disable */
/* eslint-enable */