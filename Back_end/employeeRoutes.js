  //employeeRoutes.js

const express = require('express');
const router = express.Router();
const db = require('./db');  
  //  API endpoints employee
  router.get('/api/employees', async (req, res) => {
    try {
       console.log("SELECT * FROM employee")
      const result = await db.query('SELECT * FROM project1.employee');  
      const employees = result.rows;
      res.json(employees);
    } catch (err) {
      console.error('Error fetching employees', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/api/employees', async (req, res) => {
    try {
      const { first_name, last_name, email, phone_number, is_active } = req.body;
      const result = await db.query(
        'INSERT INTO project1.employee (first_name, last_name, email, phone_number, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [first_name, last_name, email, phone_number, is_active]
      );
      const newEmployee = result.rows[0];
      res.json(newEmployee);
    } catch (err) {
      console.error('Error adding employee', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.put('/api/employees/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const { first_name, last_name, email, phone_number, is_active } = req.body;
      const client = await pool.connect();
      const result = await client.query(
        'UPDATE project1.employee SET first_name = $1, last_name = $2, email = $3, phone_number = $4, is_active = $5 WHERE id = $6 RETURNING *',
        [first_name, last_name, email, phone_number, is_active, id]
      );
      const updatedEmployee = result.rows[0];
      client.release();
      res.json(updatedEmployee);
    } catch (err) {
      console.error('Error updating employee', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.delete('/api/employees/:id', async (req, res) => {
    try {
      const employee_id = req.params.id;
       const result = await db.query('DELETE FROM project1.employee WHERE employee_id = $1', [employee_id]);  //  Change to use id column
     res.json({ message: result + 'Employee deleted successfully' });
   } catch (err) {
   console.error('Error deleting employee', err);
   res.status(500).json({ error: 'Internal Server Error' });
 }
 });

module.exports = router;
