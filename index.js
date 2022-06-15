import express from 'express';
import mongoose from 'mongoose';

import { registerValidation, loginValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import { getMe, login, register } from './controllers/UserController.js';

mongoose
  .connect(
    'mongodb+srv://admin:wwwwww@cluster0.ifqornl.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();
app.use(express.json());

// авторизация
app.post('/auth/login', loginValidation, login);
// ------------------------------------
// регистрация
app.post('/auth/register', registerValidation, register);
// ------------------------------------
// получение информации о нас, проверка авторизации
app.get('/auth/me', checkAuth, getMe);
// ------------------------------------
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
