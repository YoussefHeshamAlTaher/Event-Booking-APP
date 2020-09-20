const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;

const mongoose = require('mongoose');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const port = process.env.PORT || 5000;

const app = express();
const isAuth = require('./middleware/is-auth')

app.use(bodyParser.json());
app.use((req,res ,next) =>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    if (req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});
app.use(isAuth);

app.use(
    '/graphql',
    graphqlHttp({
    schema: graphqlSchema,
    rootValue:graphqlResolvers,
    graphiql: true

}));
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.jeiyi.gcp.mongodb.net/booking-app?retryWrites=true&w=majority`,{ useUnifiedTopology: true ,useNewUrlParser: true } )
.then(()=>
    app.listen(8000,(req,res) => {
      console.log("Server is up and running!!..");
})

).catch(err => {
    console.log(err);
});

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname + '/client/build/index.html'));
    });
  }

