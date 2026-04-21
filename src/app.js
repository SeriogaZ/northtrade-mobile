import 'express-async-errors';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import { router as apiRouter } from './routes/api.js';
import { router as siteRouter } from './routes/site.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const app = express();

app.locals.siteName = 'NorthTrade Mobile';

app.set('view engine', 'ejs');
app.set('views', path.join(projectRoot, 'src', 'views'));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(projectRoot, 'public')));
app.use('/mySassStyle', express.static(path.join(projectRoot, 'mySassStyle')));
app.use('/image_uploads', express.static(path.join(projectRoot, 'image_uploads')));

app.use('/api/v1', apiRouter);
app.use('/', siteRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);

  if (req.originalUrl.startsWith('/api')) {
    if (err.name === 'MulterError') {
      return res.status(400).json({ error: err.message });
    }
    const status = err.status ?? 500;
    const message = status === 500 ? 'Something went wrong' : err.message;
    return res.status(status).json({ error: message });
  }

  const status = err.status ?? 500;
  res.status(status).render('error', {
    title: 'Error',
    message: err?.message ?? 'Something went wrong',
    active: '',
  });
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
