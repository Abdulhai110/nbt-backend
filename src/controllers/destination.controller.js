const Destination = require("../models/destination.model");

// Create
exports.createDestination = async (req, res) => {
  try {
    const destination = new Destination(req.body);
    await destination.save();
    res.status(201).json(destination);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read All (Public)
exports.getDestinations = async (req, res) => {
  try {
    // 1. Destructure params from the request query
    const { search, page = 1, limit = 10 } = req.query;

    // 2. Build the query object
    let query = { published: true };

    // If search exists, look for the name (case-insensitive)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // 3. Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 4. Execute query with count
    const [destinations, totalCount] = await Promise.all([
      Destination.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }), // Optional: Show newest first
      Destination.countDocuments(query),
    ]);

    // 5. Send structured response
    res.json({
      data: destinations,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read Single
exports.getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination)
      return res.status(404).json({ error: "Destination not found" });
    res.json(destination);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!destination)
      return res.status(404).json({ error: "Destination not found" });
    res.json(destination);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination)
      return res.status(404).json({ error: "Destination not found" });
    res.json({ message: "Destination deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
