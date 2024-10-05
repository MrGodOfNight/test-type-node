import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import pool from './modules/db';

const app = express();
app.use(bodyParser.json()); // используем body-parser

// POST /create: создание нового пользователя
app.post('/create', async (req: Request, res: Response) => {
  const { full_name, role, efficiency } = req.body;
  if (!full_name || !role || !efficiency) {
    return res.status(400).json({ success: false }); // проверяем наличие всех необходимых полей и если не все поля заполнены, возвращаем ошибку 400
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO user (full_name, role, efficiency) VALUES (?, ?, ?)',
      [full_name, role, efficiency]
    );
    const insertId = (result as any).insertId; // получаем ID нового пользователя

    res.status(201).json({ success: true, result: { id: insertId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /get или /get/:id: получение списка пользователей или конкретного пользователя по ID
app.get('/get/:id?', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.query;

  try {
    let query = 'SELECT * FROM user';
    const queryParams: Array<string | number> = [];

    if (id) { // если указан ID, добавляем его в запрос
      query += ' WHERE id = ?';
      queryParams.push(id);
    } else if (role) { // если указана роль, добавляем её запрос
      query += ' WHERE role = ?';
      queryParams.push(role as string);
    }

    const [users] = await pool.query(query, queryParams); // получаем юзеров

    res.status(200).json({ success: true, result: { users } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /update/:id: обновление пользователя
app.patch('/update/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { full_name, role, efficiency } = req.body;

  if (!id || (!full_name && !role && !efficiency)) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const updateFields: Array<string> = []; // массив полей для обновления
    const updateValues: Array<string | number> = []; // массив значений для обновления

    // тут проверочки для полей
    if (full_name) {
      updateFields.push('full_name = ?');
      updateValues.push(full_name);
    }
    if (role) {
      updateFields.push('role = ?');
      updateValues.push(role);
    }
    if (efficiency) {
      updateFields.push('efficiency = ?');
      updateValues.push(efficiency);
    }

    updateValues.push(id);

    await pool.query(
      `UPDATE user SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // сам запросик
    const [rows] = await pool.query('SELECT * FROM user WHERE id = ?', [id]);

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // возвращаем нашего человечка
    const updatedUser = (rows as any[])[0];

    res.status(200).json({
      success: true,
      result: {
        id: updatedUser.id,
        full_name: updatedUser.full_name,
        role: updatedUser.role,
        efficiency: updatedUser.efficiency
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// DELETE /delete или /delete/:id: удаление одного пользователя по ID или всех пользователей
app.delete('/delete/:id?', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (id) {
      // ищем нашего юзера
      const [rows] = await pool.query('SELECT * FROM user WHERE id = ?', [id]);

      // проверяем его наличие
      if ((rows as any[]).length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const deletedUser = (rows as any[])[0];

      // удаляем, изи
      await pool.query('DELETE FROM user WHERE id = ?', [id]);

      // возвращаем его. Вдруг, мы его случайно удалили :D
      return res.status(200).json({
        success: true,
        result: {
          id: deletedUser.id,
          full_name: deletedUser.full_name,
          role: deletedUser.role,
          efficiency: deletedUser.efficiency
        }
      });
    } else {
      // удаляем всех пользователей. Крушить-ломать, УРА!
      await pool.query('DELETE FROM user');

      // говорим юзеру: "Ты всё уничтожил, доволен?"
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
