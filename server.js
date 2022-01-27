const express = require('express'); 
const cors = require('cors');
var bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

require('./routes/routes')(app);
require('./database/db')();


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server Listening on port ${port}...`));