import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import models, { sequelize } from './models';
import routes from './routes';

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extender: true }));

app.use(async (req, res, next) => {
  req.context = {
    models,
    me: await models.User.findByLogin('Master Chief'),
  };
  next();
});

app.use('/session', routes.session);
app.use('/users', routes.user);
app.use('/messages', routes.message);

const eraseDatabaseOnSync = true;
sequelize.sync({ force: eraseDatabaseOnSync }).then(() => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }

  app.listen(process.env.PORT, () => {
    console.log(`REST API running`);
  });
});


const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'Master Chief',
      messages: [
        {
          text: '...',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
  await models.User.create(
    {
      username: 'Captain America',
      messages: [
        {
          text: 'I understood that reference.',
        },
        {
          text: 'There\'s only one God ma\'am, and I\'m pretty sure he doesn\'t dress like that.',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};