const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = {...req.query};

    // Fields to exclude (To avoid trying to match those fields with the document's fields <Bootcamp fields> )
    const excludedFields = ["select", "sort", "page", "limit"];

    // Loop over excludedFields and delete them from the reqQuery
    excludedFields.forEach(excludedField => delete reqQuery[excludedField]);

    // Create operators
    let queryString = JSON.stringify(reqQuery);
    // gt => $gt (greater than)
    // gte => $gte (greater than or equal)
    // lt => $gt (less than)
    // lte => $lte (less than or equal)
    // in => $in (in array)
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Find resources for the passed query
    query = model.find(JSON.parse(queryString)).populate(populate);

    // Select
    if (req.query.select) {
        const selectedFields = req.query.select.split(",").join(" ");
        // Mongoose queries documentation: https://mongoosejs.com/docs/queries.html
        query = query.select(selectedFields);
    }

    // Sort
    if (req.query.sort) {
        query = query.sort(req.query.sort); // Mongoose queries documentation: https://mongoosejs.com/docs/queries.html
    } else {
        // Default sort by date
        query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }

    // Pagination result
    let pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    // Execute the query
    const results = await query;

    res.status(200).json({success: true, count: results.length, pagination, data: results});

    next();
}

module.exports = advancedResults;
