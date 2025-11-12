import express from 'express';
import Bus from '../models/Bus.js';
import Route from '../models/Route.js';

const router = express.Router();

router.get('/buses', async (req, res) => {
  try {
    const { source, destination, date, busType, minPrice, maxPrice, sortBy } = req.query;

    
    let query = {};

    if (busType) {
      query.type = busType;
    }

    const buses = await Bus.find(query);

   
    let sortedBuses = buses;
    if (sortBy === 'price') {
     
      sortedBuses = buses.sort((a, b) => a.operator.localeCompare(b.operator));
    } else if (sortBy === 'type') {
      sortedBuses = buses.sort((a, b) => a.type.localeCompare(b.type));
    }

    res.json({ buses: sortedBuses });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/routes', async (req, res) => {
  try {
    const { source, destination } = req.query;

    let query = {};
    if (source) query.source = new RegExp(source, 'i');
    if (destination) query.destination = new RegExp(destination, 'i');

    const routes = await Route.find(query);
    res.json({ routes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/routes/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json({ route });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
