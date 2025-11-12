import express from 'express';
import {
  searchBuses,
  getScheduleDetails,
  getSeatAvailability,
  getAllBuses,
  getAllRoutes,
  getRouteDetails,
} from '../controllers/busController.js';
import { validateSearch } from '../middlewares/validation.js';

const router = express.Router();

router.get('/search', validateSearch, searchBuses);

router.get('/schedules/:id', getScheduleDetails);

router.get('/schedules/:scheduleId/seats', getSeatAvailability);

router.get('/', getAllBuses);

router.get('/routes', getAllRoutes);

router.get('/routes/:id', getRouteDetails);

export default router;
