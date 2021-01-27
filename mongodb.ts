// CRUD for create read update delete
require('dotenv').config();

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = process.env.DB_HOST;
const databaseName = process.env.DB_NAME;

MongoClient.connect(
  connectionURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err: any, client: any) => {
    if (err) return console.error('Unable to connect to database');

    const db = client.db(databaseName);
    db.collection('users')
      .deleteMany({
        name: 'Test2',
      })
      .then((res: any) => console.log(res));
  },
);
