export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  return { valid: true };
};

export const validateDate = (date) => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return inputDate >= today;
};

export const validateAge = (age) => {
  return age >= 1 && age <= 120;
};

export const validateGender = (gender) => {
  return ['male', 'female', 'other'].includes(gender.toLowerCase());
};

export const sanitizeString = (str) => {
  return str.trim().replace(/[<>]/g, '');
};

export const validateBookingData = (data) => {
  const errors = [];

  if (!data.scheduleId) {
    errors.push('Schedule ID is required');
  }

  if (!data.seatIds || !Array.isArray(data.seatIds) || data.seatIds.length === 0) {
    errors.push('At least one seat must be selected');
  }

  if (!data.passengers || !Array.isArray(data.passengers) || data.passengers.length === 0) {
    errors.push('At least one passenger is required');
  }

  if (data.seatIds && data.passengers && data.seatIds.length !== data.passengers.length) {
    errors.push('Number of seats must match number of passengers');
  }

  if (data.passengers) {
    data.passengers.forEach((passenger, index) => {
      if (!passenger.name || passenger.name.trim().length === 0) {
        errors.push(`Passenger ${index + 1}: Name is required`);
      }
      
      if (!passenger.age || !validateAge(passenger.age)) {
        errors.push(`Passenger ${index + 1}: Valid age is required (1-120)`);
      }
      
      if (!passenger.gender || !validateGender(passenger.gender)) {
        errors.push(`Passenger ${index + 1}: Valid gender is required (male/female/other)`);
      }
      
      if (!passenger.seatNumber) {
        errors.push(`Passenger ${index + 1}: Seat number is required`);
      }
    });
  }

  if (!data.paymentMethod) {
    errors.push('Payment method is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateSearchParams = (params) => {
  const errors = [];

  if (!params.source || params.source.trim().length === 0) {
    errors.push('Source is required');
  }

  if (!params.destination || params.destination.trim().length === 0) {
    errors.push('Destination is required');
  }

  if (!params.date) {
    errors.push('Date is required');
  } else if (!validateDate(params.date)) {
    errors.push('Date must be today or in the future');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
