'use strict';

module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define(
    'Appointment',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // References the Users table
          key: 'id',
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      service: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending', // Default status
      },
    },
    {}
  );

  Appointment.associate = function (models) {
    // Define the relationship between Appointment and User
    Appointment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE', // Automatically delete appointments if user is deleted
    });
  };

  return Appointment;
};

// Create a new appointment
document.getElementById('create-appointment-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const service = document.getElementById('service').value;
  const date = document.getElementById('appointment-date').value;
  const time = document.getElementById('appointment-time').value;
  const price = document.getElementById('appointment-price').value;

  try {
      const response = await fetch('/appointments/create', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ service, date, time, price })
      });

      if (response.ok) {
          alert('Appointment created successfully');
          location.reload(); // Reload the page to display the new appointment
      } else {
          alert('Failed to create appointment');
      }
  } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Error creating appointment');
  }
});

// Edit an existing appointment (pass appointment ID for reference)
function editAppointment(appointmentId) {
  // Retrieve the appointment data and pre-populate the form fields
  // For simplicity, the function is just opening a form (you should fetch data from the backend)
  const modal = new bootstrap.Modal(document.getElementById('newAppointmentModal'));
  modal.show();

  // Example of pre-filling the form (you should fill the fields with the actual data from the server)
  document.getElementById('service').value = 'Sample Service';
  document.getElementById('appointment-date').value = '2024-11-01';
  document.getElementById('appointment-time').value = '10:00';
  document.getElementById('appointment-price').value = 50;
}

// Delete an appointment (pass appointment ID for reference)
function deleteAppointment(appointmentId) {
  if (confirm('Are you sure you want to delete this appointment?')) {
      fetch(`/appointments/delete/${appointmentId}`, {
          method: 'DELETE'
      })
      .then(response => {
          if (response.ok) {
              alert('Appointment deleted successfully');
              location.reload(); // Reload to reflect the deletion
          } else {
              alert('Failed to delete appointment');
          }
      })
      .catch(error => {
          console.error('Error deleting appointment:', error);
          alert('Error deleting appointment');
      });
  }
}
