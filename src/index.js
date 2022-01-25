const express = require('express');
require('./db/mongoose');
const animeRouter = require('./routers/anime');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(animeRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});