export const verificationEmailTemplate = (firstName, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 5px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h2>Welcome to Bus Booking System!</h2>
          <p>Hi ${firstName},</p>
          <p>Thank you for registering with us. Please verify your email address to complete your registration.</p>
          <a href="${verificationUrl}" class="button">Verify Email</a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Bus Booking System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const passwordResetEmailTemplate = (firstName, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 5px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #dc3545;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h2>Password Reset Request</h2>
          <p>Hi ${firstName},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Bus Booking System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const bookingConfirmationEmailTemplate = (firstName, booking) => {
  const { bookingReference, schedule, passengers, totalAmount, seats } = booking;
  
  const passengerList = passengers.map(p => 
    `<li>${p.name} - ${p.age} years - ${p.gender} - Seat: ${p.seatNumber}</li>`
  ).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 5px;
        }
        .booking-details {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #666;
        }
        .success {
          color: #28a745;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h2 class="success">✓ Booking Confirmed!</h2>
          <p>Hi ${firstName},</p>
          <p>Your bus ticket has been successfully booked. Here are your booking details:</p>
          
          <div class="booking-details">
            <h3>Booking Reference: ${bookingReference}</h3>
            <p><strong>Route:</strong> ${schedule.route.source} → ${schedule.route.destination}</p>
            <p><strong>Bus Operator:</strong> ${schedule.bus.operator}</p>
            <p><strong>Bus Type:</strong> ${schedule.bus.type}</p>
            <p><strong>Departure:</strong> ${new Date(schedule.departureDate).toLocaleDateString()} at ${schedule.departureTime}</p>
            <p><strong>Arrival:</strong> ${new Date(schedule.arrivalDate).toLocaleDateString()} at ${schedule.arrivalTime}</p>
            <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
            
            <h4>Passengers:</h4>
            <ul>
              ${passengerList}
            </ul>
          </div>
          
          <p>Please arrive at the boarding point at least 15 minutes before departure.</p>
          <p>Have a safe journey!</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Bus Booking System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const bookingCancellationEmailTemplate = (firstName, booking) => {
  const { bookingReference, schedule, totalAmount } = booking;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 5px;
        }
        .booking-details {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #666;
        }
        .warning {
          color: #dc3545;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h2 class="warning">Booking Cancelled</h2>
          <p>Hi ${firstName},</p>
          <p>Your booking has been successfully cancelled.</p>
          
          <div class="booking-details">
            <h3>Booking Reference: ${bookingReference}</h3>
            <p><strong>Route:</strong> ${schedule.route.source} → ${schedule.route.destination}</p>
            <p><strong>Departure:</strong> ${new Date(schedule.departureDate).toLocaleDateString()} at ${schedule.departureTime}</p>
            <p><strong>Refund Amount:</strong> ₹${booking.paymentStatus === 'refunded' ? totalAmount : 0}</p>
          </div>
          
          <p>The refund will be processed within 5-7 business days.</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Bus Booking System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
