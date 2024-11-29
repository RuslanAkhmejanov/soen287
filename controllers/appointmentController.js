import { createRequire } from 'module';
import { fileURLToPath } from 'url';

import { parseBusinessData } from '../helpers/businessHelper.js';

// not defined in ES modules, so need to manually do it
const __filename = fileURLToPath(import.meta.url);
const require = createRequire(__filename);
const db = require('../models/index.cjs');

export const getAppointment = async (req, res) => {
    try {
        const business = await db.Business.findOne({
            order: [['id', 'DESC']]
        });
        parseBusinessData(business);
        res.render('client-side/appointment', { business: business });
    } catch (error) {
        res.status(500).send();
    }
}

// Create a new appointment
export const createAppointment = async (req, res) => {
    const { employee, service, date, time } = req.body;

    try {
        const user = await db.User.findByPk(req.session.userId);
        const userId = user.id;
        // Create the new appointment in the database
        const newAppointment = await db.Appointment.create({
            employee,
            service,
            date,
            time,
            userId,
        });

        // Send a success response
        res.status(201).json({ 
            message: 'Appointment created successfully!', 
            appointmentId: newAppointment.id 
        });
    } catch (error) {
        // Log any errors
        console.error("Error Creating Appointment:", error.message);

        // Send an error response
        res.status(500).json({ 
            message: 'Error creating appointment', 
            error: error.message 
        });
    }
};

export const cancelAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    try {
        await db.Appointment.destroy({
            where: { id: appointmentId }
        });

        res.status(200).json({ message: 'Appointment canceled successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to cancel appointment' });
    }
}

export const approveAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    try {
        await db.Appointment.update(
            { status: 'Approved' },
            { where: { id: appointmentId } }
          )
        res.status(200).json({ message: 'Appointment approved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to cancel appointment' });
    }
}