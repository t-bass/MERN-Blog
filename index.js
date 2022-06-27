import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import { PostController, UserController } from './controllers/index.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';

mongoose
  .connect(
    'mongodb+srv://admin:wwwwww@cluster0.ifqornl.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// авторизация
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
// ------------------------------------
// регистрация
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
// ------------------------------------
// получение информации о нас, проверка авторизации
app.get('/auth/me', checkAuth, UserController.getMe);
// ------------------------------------

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/tags', PostController.getLastTags);

// получение всех статей
app.get('/posts', PostController.getAll);

// получение тегов
app.get('/posts/tags', PostController.getLastTags);

// получение одной статьи
app.get('/posts/:id', PostController.getOne);

//создать статью
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);

// удаление статьи
app.delete('/posts/:id', checkAuth, PostController.remove);

//изменение, обновление статьи
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
