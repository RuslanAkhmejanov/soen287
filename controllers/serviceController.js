import db from '../models/index.cjs';

// Add a new service
export const addService = async (req, res) => {
    try {
        const { name } = req.body;
        await db.Service.create({ name });
        res.redirect('/settings');
    } catch (error) {
        console.error('Error adding service:', error.message);
        res.status(500).send('Error adding service');
    }
};

// Delete a service
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        await db.Service.destroy({ where: { id } });
        res.redirect('/settings');
    } catch (error) {
        console.error('Error deleting service:', error.message);
        res.status(500).send('Error deleting service');
    }
};

