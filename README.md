# InstantMessaging

## Minimum requirements to run
- npm and node must be installed.

## Directory content
- The main directory contains: 
  - Library configuration files.
  - Utility and test files.
  - There is the main file of the server, which is called index.js.
- There is a directory called `client`, in which the client functionality is located:
  - Library configuration files.
  - There is a directory called `src`, in which the main files are located:
    - Css configuration
    - In file `App.js` there is all the functionality for the client (Visualization and logic).

## Needed information to run application
### Instructions for server

- The server is located in the `index.js` file.
- Run `npm install` to install dependencies: socket.io, socket.io-client, dotenv and express.
- Run `node index.js` to start the server, which will run on port 2021 by default.

### Instructions for react client
 - The client is located in the `client` directory.
 - `cd` into the client directory and run `npm install` to install dependencies: socket.io-client and react-bootstrap.
 - Run `npm start` to start the react client on port 3000.
 - Specify the **ip** and **port** of the recepient.
 - Specify if the user starts or not the connection.
 - If the user starts the connection it should click **Exchange Keys** to start it.
 - When the user decides to inject an incorrect MAC it should toggle the **Inject Custom MAC** switch.
 - In case the user receives an invalid MAC message, a Toast will be shown to indicate the invalid integrity of that message.
