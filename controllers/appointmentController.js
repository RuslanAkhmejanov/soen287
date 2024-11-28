// Import the Appointment model
import Appointment from '../models/appointment.js'; 

// Create a new appointment
export const createAppointment = async (req, res) => {
    const { employee, service, date, time, userId } = req.body;

    try {
        console.log("Received Appointment Data:", req.body);

        // Create the new appointment in the database
        const newAppointment = await Appointment.create({
            employee,
            service,
            date,
            time,
            userId,
        });

        console.log("New Appointment Created:", newAppointment);

        res.status(201).json({ 
            message: 'Appointment created successfully!', 
            appointmentId: newAppointment.id 
        });
    } catch (error) {
        console.error("Error Creating Appointment:", error.message);
        res.status(500).json({ 
            message: 'Error creating appointment', 
            error: error.message 
        });
    }
};

// Get all appointments for a user
export const getAppointmentsForUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const appointments = await Appointment.findAll({ where: { userId } });
        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error Fetching Appointments:", error.message);
        res.status(500).json({ 
            message: 'Error fetching appointments', 
            error: error.message 
        });
    }
};

// Update an appointment
export const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        await appointment.update(updatedData);

        res.status(200).json({ 
            message: 'Appointment updated successfully', 
            appointment 
        });
    } catch (error) {
        console.error("Error Updating Appointment:", error.message);
        res.status(500).json({ 
            message: 'Error updating appointment', 
            error: error.message 
        });
    }
};

// Cancel an appointment
export const cancelAppointment = async (req, res) => {
    const { id } = req.params;

    try {
        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        await appointment.destroy();

        res.status(200).json({ message: 'Appointment canceled successfully' });
    } catch (error) {
        console.error("Error Canceling Appointment:", error.message);
        res.status(500).json({ 
            message: 'Error canceling appointment', 
            error: error.message 
        });
    }
};
