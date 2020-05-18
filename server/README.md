# No Touch Menu

## API DOCS

[Hosted on Postman](https://documenter.getpostman.com/view/1511886/SzmmVEqX?version=latest)

### Installing & config

1. Clone repo and run `npm i` to install all packages

2. In the `server.js` file, you can modify the database location and name on line 22

### Running the project

3. Add a `.env` flie to the root directory when first cloning this project for storing environment variables

4. Add a `config.js` to the `middlewares` file and add your own secret phrase

```javascript
module.exports = {
  secret: 'worldisfullofdevelopers',
};
```

5. Start the server with nodemon: `nodemon start server.js`

6. Restart running server by typing: `rs`

### Adding entities to the database

7. Add to db though postman using following syntax:

```javascript
{
"email":"test@test.com",
"password":"123"
}
```

This means that you need to have an empty object with the key pair items that the database is expecting to receive.
