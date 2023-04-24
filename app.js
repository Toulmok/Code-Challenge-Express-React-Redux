import dotenv from 'dotenv'
dotenv.config({path:'./server/.env'})
import Server from './server/server.js'
const server = new Server()

server.listen()