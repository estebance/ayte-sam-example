const serverlessExpress = require('@vendia/serverless-express');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const router = express.Router();

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/users', (req, res) => {
  res.json({ user: 'Pepe'})
});

app.use('/', router)

exports.handler = serverlessExpress({ app })
