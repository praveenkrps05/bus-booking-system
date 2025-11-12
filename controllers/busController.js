import Bus from '../models/Bus.js';
import Route from '../models/Route.js';
import Schedule from '../models/Schedule.js';
import Seat from '../models/Seat.js';

export const searchBuses = async (req, res, next) => {
  try {
    const { 
      source, 
      destination, 
      date, 
      busType, 
      minPrice, 
      maxPrice, 
      sortBy = 'departureTime',
      operator 
    } = req.query;

    if (!source || !destination || !date) {
      return res.status(400).json({
        success: false,
        message: 'Source, destination, and date are required',
      });
    }

    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const routeQuery = {
      source: new RegExp(source, 'i'),
      destination: new RegExp(destination, 'i'),
    };

    const routes = await Route.find(routeQuery);
    
    if (routes.length === 0) {
      return res.json({
        success: true,
        schedules: [],
        message: 'No routes found for this search',
      });
    }

    const routeIds = routes.map(route => route._id);

    const scheduleQuery = {
      route: { $in: routeIds },
      departureDate: {
        $gte: searchDate,
        $lt: nextDay,
      },
      status: 'scheduled',
      availableSeats: { $gt: 0 },
    };

    if (minPrice || maxPrice) {
      scheduleQuery.price = {};
      if (minPrice) scheduleQuery.price.$gte = Number(minPrice);
      if (maxPrice) scheduleQuery.price.$lte = Number(maxPrice);
    }

    let schedules = await Schedule.find(scheduleQuery)
      .populate({
        path: 'bus',
        match: busType ? { type: busType } : operator ? { operator: new RegExp(operator, 'i') } : {},
      })
      .populate('route');

    schedules = schedules.filter(schedule => schedule.bus !== null);

    switch (sortBy) {
      case 'price':
        schedules.sort((a, b) => a.price - b.price);
        break;
      case 'duration':
        schedules.sort((a, b) => a.route.duration - b.route.duration);
        break;
      case 'departureTime':
        schedules.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
        break;
      default:
        break;
    }

    res.json({
      success: true,
      count: schedules.length,
      schedules,
    });
  } catch (error) {
    next(error);
  }
};

export const getScheduleDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findById(id)
      .populate('bus')
      .populate('route');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    const seats = await Seat.find({ schedule: id });

    res.json({
      success: true,
      schedule,
      seats,
    });
  } catch (error) {
    next(error);
  }
};

export const getSeatAvailability = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;

    const schedule = await Schedule.findById(scheduleId);
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    let seats = await Seat.find({ schedule: scheduleId });

    if (seats.length === 0) {
      const bus = await Bus.findById(schedule.bus);
      const seatNumbers = [];
      
      for (let i = 1; i <= bus.capacity; i++) {
        const seatType = i % 3 === 1 ? 'window' : i % 3 === 0 ? 'aisle' : 'middle';
        seatNumbers.push({
          schedule: scheduleId,
          seatNumber: `S${i}`,
          seatType,
          isBooked: false,
        });
      }

      seats = await Seat.insertMany(seatNumbers);
    }

    const availableSeats = seats.filter(seat => !seat.isBooked);
    const bookedSeats = seats.filter(seat => seat.isBooked);

    res.json({
      success: true,
      totalSeats: seats.length,
      availableSeats: availableSeats.length,
      bookedSeats: bookedSeats.length,
      seats,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBuses = async (req, res, next) => {
  try {
    const { type, operator, page = 1, limit = 10 } = req.query;

    const query = {};
    if (type) query.type = type;
    if (operator) query.operator = new RegExp(operator, 'i');

    const buses = await Bus.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Bus.countDocuments(query);

    res.json({
      success: true,
      buses,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalBuses: count,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRoutes = async (req, res, next) => {
  try {
    const { source, destination, page = 1, limit = 10 } = req.query;

    const query = {};
    if (source) query.source = new RegExp(source, 'i');
    if (destination) query.destination = new RegExp(destination, 'i');

    const routes = await Route.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Route.countDocuments(query);

    res.json({
      success: true,
      routes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalRoutes: count,
    });
  } catch (error) {
    next(error);
  }
};

export const getRouteDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const route = await Route.findById(id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found',
      });
    }

    res.json({
      success: true,
      route,
    });
  } catch (error) {
    next(error);
  }
};
