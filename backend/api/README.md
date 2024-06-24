# API

## To Run localhost

Make sure the following are installed:

In order to run on localhost ensure `node.js`, `npm`, `express`, and `mongodb` are installed:

```bash
sudo apt-get install nodejs
sudo apt-get install npm
sudo npm install -g n 
sudo npm install express
sudo npm install cors
sudo npm install dotenv
sudo npm install mongodb
```

Once all dependencies have been installed, run 

```bash 
sudo npm start
```

to start the node server on port 5000.

## Testing Locally With Postman

Once you have started the server on port 5000, you can go to Postman to test the backend.

Create a new request and set the URL to `http://localhost:5000/api/'endpoint'`. From there go to "Body" > "raw" and structure your JSON to have the proper parameters for your request. 

### Ensure You Have Your .env File Configured

In order to make connections with the database, ensure that you have a `.env` 
