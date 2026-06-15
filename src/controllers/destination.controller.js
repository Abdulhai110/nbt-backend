// src/controllers/destination.controller.js
const DestinationService = require('../services/destination');

const handleError = (res, err, status = 500) => {
  console.error('[Destination]', err.message);
  res.status(err.message.includes('not found') ? 404 : status).json({ error: err.message });
};

// ── Admin ──────────────────────────────────────────────────────────────────────

exports.createDestination = async (req, res) => {
  try {
    const destination = await DestinationService.createDestination(req.body, req.files);
    res.status(201).json({ data: destination });
  } catch (err) { handleError(res, err, 400); }
};

exports.updateDestination = async (req, res) => {
  try {
    const destination = await DestinationService.updateDestination(req.params.id, req.body, req.files);
    res.json({ data: destination });
  } catch (err) { handleError(res, err); }
};

exports.deleteDestination = async (req, res) => {
  try {
    const result = await DestinationService.deleteDestination(req.params.id);
    res.json(result);
  } catch (err) { handleError(res, err); }
};

exports.getAllDestinationsAdmin = async (req, res) => {
  try {
    const destinations = await DestinationService.getAllDestinations();
    res.json({ data: destinations });
  } catch (err) { handleError(res, err); }
};

exports.getDestinationByIdAdmin = async (req, res) => {
  try {
    const destination = await DestinationService.getDestinationById(req.params.id);
    res.json({ data: destination });
  } catch (err) { handleError(res, err); }
};

// ── Public ─────────────────────────────────────────────────────────────────────

exports.getDestinations = async (req, res) => {
  try {
    const result = await DestinationService.getPublicDestinations(req.query);
    res.json(result);
  } catch (err) { handleError(res, err); }
};

exports.getDestinationById = async (req, res) => {
  try {
    const destination = await DestinationService.getDestinationById(req.params.id);
    if (!destination.published) return res.status(403).json({ error: 'Forbidden' });
    res.json({ data: destination });
  } catch (err) { handleError(res, err); }
};