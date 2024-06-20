const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');

// express app
const app = express();

app.listen(5000, () => {
    console.log('listening on port 5000')
})