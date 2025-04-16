const ChargingPoint = require('../models/chargingPointModel'); 

// Create a new charging point
exports.createChargingPoint = async (req, res) => {
    try {
        const { name, location, mobile } = req.body;

        // Validate required fields
        if (!name || !location || !mobile) {
            return res.status(400).send({
                success: false,
                message: 'All fields (name, location, mobile) are required',
            });
        }

        // Create a new charging point in the database
        const newChargingPoint = await ChargingPoint.create({
            name,
            location,
            mobile,
        });

        res.status(201).send({
            success: true,
            data: newChargingPoint,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Server Error',
        });
    }
};

// Get all charging points
exports.getChargingPoints = async (req, res) => {
    try {
        const chargingPoints = await ChargingPoint.findAll();

        res.status(200).send({
            success: true,
            results: chargingPoints.length,
            data: chargingPoints,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Server Error',
        });
    }
};

// // Get a single charging point by ID
exports.getChargingPointById = async (req, res) => {
    try {
        const chargingPoint = await ChargingPoint.findByPk(req.params.id);

        if (chargingPoint === 0) {
            return res.status(404).send({
                success: false,
                message: 'Charging Point not found',
            });
        }

        res.status(200).send({
            success: true,
            data: chargingPoint,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Server Error',
        });
    }
};

// // Update a charging point
exports.updateChargingPoint = async (req, res) => {
    try {
        const { name, location, status , mobile , email } = req.body;

        const chargingPoint = await ChargingPoint.findByPk(req.params.id);

        if (!chargingPoint) {
            return res.status(404).send({
                success: false,
                message: 'Charging Point not found',
            });
        }

        await chargingPoint.update({ name, location, status , mobile , email});

        res.status(200).send({
            success: true,
            data: chargingPoint,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Server Error',
        });
    }
};

// // Delete a charging point
exports.deleteChargingPoint = async (req, res) => {
    try {
        const chargingPoint = await ChargingPoint.destroy({ where: { id: req.params.id } });

        if (!chargingPoint) {
            return res.status(404).send({
                success: false,
                message: 'Charging Point not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Charging Point deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Server Error',
        });
    }
};
