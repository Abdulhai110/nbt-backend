// src/controllers/gallery.controller.js
const GalleryService = require('../services/gallery');

const handleError = (res, err) => {
  console.error('[Gallery]', err.message);
  const status = err.message.includes('not found') ? 404
               : err.message.includes('required')  ? 400
               : 500;
  res.status(status).json({ error: err.message });
};

// ── Admin ──────────────────────────────────────────────────────────────────────
exports.getAllAdmin     = async (req, res) => { try { res.json({ data: await GalleryService.getAllAdmin() }); }      catch (e) { handleError(res, e); } };
exports.getByIdAdmin   = async (req, res) => { try { res.json({ data: await GalleryService.getById(req.params.id) }); } catch (e) { handleError(res, e); } };
exports.createGalleryItem = async (req, res) => { try { res.status(201).json({ data: await GalleryService.createItem(req.body, req.file) }); } catch (e) { handleError(res, e); } };
exports.updateGalleryItem = async (req, res) => { try { res.json({ data: await GalleryService.updateItem(req.params.id, req.body, req.file) }); } catch (e) { handleError(res, e); } };
exports.deleteGalleryItem = async (req, res) => { try { res.json(await GalleryService.deleteItem(req.params.id)); } catch (e) { handleError(res, e); } };

// ── Public ─────────────────────────────────────────────────────────────────────
exports.getAllGalleryItems = async (req, res) => { try { res.json(await GalleryService.getPublic(req.query)); } catch (e) { handleError(res, e); } };
exports.getGalleryItemById = async (req, res) => {
  try {
    const item = await GalleryService.getById(req.params.id);
    if (!item.published) return res.status(403).json({ error: 'Forbidden' });
    res.json({ data: item });
  } catch (e) { handleError(res, e); }
};