# API

## To Run localhost

Make sure the following are installed inside of the `api` directory:

In order to run on localhost ensure `node.js`, `npm`, `express`, `mongodb`, and 'typescript' are installed. To do this run

```bash
sudo npm install
```

This will install all of the necessary packages.

Next run

```bash 
sudo npm start
```

to start the node server on port 5000.

## Testing Locally With Postman

Once you have started the server on port 5000, you can go to Postman to test the backend.

Create a new request and set the URL to `http://localhost:5000/api/'endpoint'`. From there go to "Body" > "raw" and structure your JSON to have the proper parameters for your request. 

### Ensure You Have Your .env File Configured

In order to make connections with the database, ensure that you have a `.env` file added to your local version of the source code. I emailed everyone the secrets, so check your UCF email for that.
