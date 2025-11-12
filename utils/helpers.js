export const generateBookingReference = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `BK${timestamp}${random}`;
};

export const generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100000);
  return `TXN${timestamp}${random}`;
};

export const calculateRefundAmount = (totalAmount, hoursBeforeDeparture) => {
  if (hoursBeforeDeparture >= 24) {
    return totalAmount;
  } else if (hoursBeforeDeparture >= 12) {
    return totalAmount * 0.75;
  } else if (hoursBeforeDeparture >= 6) {
    return totalAmount * 0.50;
  } else if (hoursBeforeDeparture >= 2) {
    return totalAmount * 0.25;
  } else {
    return 0;
  }
};

export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatTime = (time) => {
  if (typeof time === 'string') {
    return time;
  }
  
  const d = new Date(time);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const calculateDuration = (departureTime, arrivalTime) => {
  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);
  const durationMs = arrival - departure;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

export const getHoursUntilDeparture = (departureDate, departureTime) => {
  const departure = new Date(`${departureDate} ${departureTime}`);
  const now = new Date();
  const diffMs = departure - now;
  return diffMs / (1000 * 60 * 60);
};

export const isPastDate = (date) => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate < today;
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatCurrency = (amount) => {
  return `₹${amount.toFixed(2)}`;
};

export const paginate = (page = 1, limit = 10) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  
  return {
    skip: (pageNum - 1) * limitNum,
    limit: limitNum,
  };
};

export const buildPaginationResponse = (data, total, page, limit) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  
  return {
    data,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum * limitNum < total,
      hasPrevPage: pageNum > 1,
    },
  };
};

export const generateSeatLayout = (capacity) => {
  const seats = [];
  const rows = Math.ceil(capacity / 4);
  
  for (let row = 1; row <= rows; row++) {
    for (let col = 1; col <= 4; col++) {
      const seatNumber = (row - 1) * 4 + col;
      if (seatNumber <= capacity) {
        let seatType = 'middle';
        if (col === 1 || col === 4) {
          seatType = 'window';
        } else if (col === 2) {
          seatType = 'aisle';
        }
        
        seats.push({
          seatNumber: `S${seatNumber}`,
          row,
          column: col,
          seatType,
        });
      }
    }
  }
  
  return seats;
};

export const maskEmail = (email) => {
  const [username, domain] = email.split('@');
  const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
};

export const maskPhone = (phone) => {
  return phone.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2');
};
