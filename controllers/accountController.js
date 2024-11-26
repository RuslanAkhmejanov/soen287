import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

// not defined in ES modules, so need to manually do it
const __filename = fileURLToPath(import.meta.url);
const require = createRequire(__filename);
const db = require('../models/index.cjs');

export const getAccount = async (req, res) => {
    try {
        const user = await db.User.findByPk(req.session.userId);
        res.render('client-side/account', { user: user });
    } catch (error) {
        res.status(500).send();
    }
};


// delete account
export const deleteAccount = async (req, res) => {
    try {
      const user = await db.User.findByPk(req.session.userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
      await user.destroy();
      req.session.destroy(); // destroy session after account deletion
      res.status(200).send('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error.message);
      res.status(500).send('Error deleting account');
    }
  };
  
  // update account
  export const updateAccount = async (req, res) => {
    try {
      const user = await db.User.findByPk(req.session.userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
      const { name, username, password } = req.body;
      const updatedData = {
        name: name || user.name,
        username: username || user.username,
      };
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedData.password = hashedPassword;
      }
      await user.update(updatedData);
      res.status(200).json(user);
    } catch (error) {
      console.error('Error updating account:', error.message);
      res.status(500).send('Error updating account');
    }
  };
