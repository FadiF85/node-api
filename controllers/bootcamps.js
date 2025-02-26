// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({success: true, msg: "Show all bootcamps!"});
}

// @desc Get a single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Display bootcamp ${req.params.id}`});
}

// @desc Create a new single bootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = (req, res, next) => {
    res.status(201).json({success: true, msg: "Create new bootcamp"});
}

// @desc Update a single bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Update bootcamp ${req.params.id}`});
}

// @desc Delete a single bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Delete bootcamp ${req.params.id}`});
}
