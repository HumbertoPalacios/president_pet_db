import {Router} from 'express'; // Import Router 

// CREATE a function thats designed to create and configure a router
const presidentRoutes = (pool) => {
    const router = Router(); // Create a router object 

// GET method that retrieves all records from the president table 
router.get("/", (req, res) => {
    pool.query(`SELECT * FROM president`) // Query the selects all the records from the president table
        .then((data) => { // If query was successful
            res.json(data.rows) // Respond with all the records in JSON format
        })
        .catch((err) => { // If query was unsuccessful 
            console.error(err); // Log the error
            res.status(500); // And respond with 500 Internal Server Error
        })
})

// GET method that retrieves a single record from the president table given a specific ID
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id); // Parse string into int and store it in id const

    if(isNaN(id)) { // Verify if id is a number 
        res.status(400).send("Invalid ID"); // If not, send message
        return; // And terminate execution
    }

    pool.query(`SELECT * FROM president WHERE presidentId = $1`, [id]) // Query that selects a single president with a specific Id
    .then((data) => { // If query was successful
        if (data.rows.length === 0) { // Verify if such data with ID exists
            res.sendStatus(404); // If not, send 404 message
            return; // And terminate execution 
        }
        res.json(data.rows[0]); // If it does exist, respond with selected data in JSON format
    })
    .catch((err) => { // If query was unsuccessful
        console.error(err); // Log error message
        res.sendStatus(500); // And respond with 500 Internal Servor Error message
    })
})

// POST METHOD that adds a new record in president table 
router.post("/", (req, res) => {

    const chronologicalNumber = parseInt(req.body.chronologicalNumber); // parse string into an int and store it in a const
    const fullName = req.body.fullName; // store fullName input into a a const
    const startYear = parseInt(req.body.startYear); // parse string into an int and store it in a const
    const endYear = parseInt(req.body.endYear); // parse string into an int and store it in a const
    const hadPets = Boolean(req.body.hadPets); // change string string into a boolean and store in a const 

    if(!chronologicalNumber || !fullName || !startYear || !endYear || !hadPets) { // Verify if client inputted required data
        res.status(400).send("Missing President Information"); // If not, send message 
        return; // Terminate execution 
    }

    // Query that inserts record into table with given input
    pool.query(`INSERT INTO president (chronologicalNumber, fullName, startYear, endYear, hadPets)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`, [chronologicalNumber, fullName, startYear, endYear, hadPets])
    .then((data) => { // If query was successful, 
        res.json(data.rows[0]); // Respond with created data in JSON format
    })
    .catch((err) => { // If query was unsuccessful
        console.error(err); // Log error message
        res.sendStatus(500); // Respond with 500 Internal Server Error
    })
})

// PATCH method that updates certain record from a specific ID
router.patch("/:id", (req, res) => {
    const id = parseInt(req.params.id); // Parse string into an int and store in variable 
    if (isNaN(id)) { // Verify if it is a number
        res.status(400).send("Invalid ID"); // If not, send 400 message 
        return; // And terminate execution 
    }

    // Extract the values from req.body and initialize to null if undefined
    const chronologicalNumber = req.body.chronologicalNumber ? parseInt(req.body.chronologicalNumber) : null;
    const startYear = req.body.startYear ? parseInt(req.body.startYear) : null;
    const endYear = req.body.endYear ? parseInt(req.body.endYear) : null;
    const fullName = req.body.fullName;
    const hadPets = req.body.hadPets === 'true' ? true : req.body.hadPets === 'false' ? false : null; // Convert 'hadPets' correctly

    // Query that updates certain information from a record with a specific Id. However, if no update on a value, keep the value from db
    pool.query(`UPDATE president SET
    chronologicalNumber = COALESCE($1, chronologicalNumber),
    fullName = COALESCE($2, fullName),
    startYear = COALESCE($3, startYear),
    endYear = COALESCE($4, endYear),
    hadPets = COALESCE($5, hadPets)
    WHERE presidentId = $6 RETURNING *`,
    [chronologicalNumber, fullName, startYear, endYear, hadPets, id])
    .then((data) => { // If query was successful
        if(data.rows.length === 0) { // Verify if record was updated
            res.sendStatus(404); // If not, send 404 message
            return; // And terminate execution 
        }
        res.json(data.rows[0]); // If record was updated, respond with data in JSON format
    })
    .catch((err) => { // If query was unsuccessful,
        console.error(err); // Log error 
        res.sendStatus(500); // And respond with 500 Internal Server Error
    })
})

// DELETE method that deletes record with a specific ID
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id); // Parse string into int and store in const 
    if (isNaN(id)) { // Verify if it is a number 
        res.status(400).send("Invalid ID"); // If not, send 400 message
        return; // Terminate execution 
    }

    pool.query(`DELETE FROM presidents WHERE presidentId = $1 RETURNING *`, [id]) // Query that deletes a record from the president table with a given id
    .then((data) => { // If query was successful
        if(data.rows.length === 0) { // Verify if record was deleted
            res.status(404).send("No presidents found with that given id.");  // If not, respond with a 404 and message stating that no president had that Id
        }
        res.status(200).send(`President with id ${id} has been deleted.`); // If record was deleted, respond with a 200 and message stating it was successful
    })
    .catch((err) => { // If query was unsuccessful 
        console.error(err); // Log error 
        res.sendStatus(500); // Respond with a 500 Internal Server Error
    })
})

return router; // Return configured Router
};
 
export default presidentRoutes; // Export presidentRoutes so it can be utilized externally 

