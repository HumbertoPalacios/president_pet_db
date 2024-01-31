import { Router } from 'express'; // Import Router

// CREATE a function thats designed to create and configure a router 
const petRoutes = (pool) => {
  const router = Router(); // Create a router object

// GET method that retrieves all pets from db
router.get("/", (req, res) => {
    pool.query(`SELECT * FROM pet`) // Query that selects all pet records from db
    .then((data) => { // If query was successful
        res.json(data.rows) // Respond with all records in JSON format
    })
    .catch((err) => { // If query was unsuccessful
        console.error(err); // Log out error
        res.sendStatus(500); // Respond 500 Internal Server Error
    })
});

// GET method that retrieves a single pet with a specific Id 
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id); // Parse string into into and store it in const
    if(isNaN(id)) { // Verify if id is a number 
        res.status(400).send("Invalid Id"); // If not, respons with a message
        return; // And terminate the execution
    }

    pool.query(`SELECT * FROM pet WHERE petId = $1`, [id]) // Query that selects all data from a pet with a specific ID
    .then((data) => { // If query was successful
        if(data.rows.length === 0) { // Verify if pet with Id exists 
            res.status(404).send("No pet with that Id found."); // If not, send message
            return; // And terminate the execution 
        }
        else { // If pet with Id exists
            res.json(data.rows[0]); // Respond with record in JSON format
        }
    })
    .catch((err) => { // If query was unsuccessful
        console.error(err); // Log out error
        res.sendStatus(500); // Respond 500 Internal Server Error
    })
});

// POST method the adds a pet record into db
router.post("/", (req, res) => {
    const fullName = req.body.fullName; // Store input into fullName const 
    const species = req.body.species; // Store input into species const 
    const presidentId = parseInt(req.body.presidentId); // Parse string into int and store it in presidentId const

    if(!fullName || !species || isNaN(presidentId)) { // Verify if client inputted required data
        res.status(400).send("Missing pet information."); // If not, send message 
        return; // And terminate execution
    }

    // Query that inserts record into table with given input
    pool.query(`INSERT INTO pet (fullName, species, presidentId) VALUES ($1, $2, $3) RETURNING *`, [fullName, species, presidentId])
    .then((data) => { // If query was successful
        res.json(data.rows[0]); // Respond with created record in JSON format
    })
    .catch((err) => { // If query was unsuccessful 
        console.error(err); // Log out error
        res.sendStatus(500); // And respond with a 500 Internal Server Error
    })
});

// PATCH method that updates certain record from a specific ID
router.patch("/:id", (req, res) => {
    const id = parseInt(req.params.id); // Parse string into an int and store in variable 
    if(isNaN(id)) { // Verify if input is a number
        res.status(400).send("Invalid ID"); // If not, respond with message
        return; // And terminate execution
    }

    // Extract the values from req.body and initialize to null if undefined
    const fullName = req.body.fullName;
    const species = req.body.species;
    const presidentId = req.body.presidentId ? parseInt(req.body.presidentId) : null;

     // Query that updates certain information from a record with a specific Id. However, if no update on a value, keep the value from db
    pool.query(`UPDATE pet SET 
    fullName = COALESCE($1, fullName),
    species = COALESCE($2, species),
    presidentId = COALESCE($3, presidentId)
    WHERE petId = $4 RETURNING *`, [fullName, species, presidentId, id])
    .then((data) => { // If query was successful,
        if(data.rows.length === 0) { // Verify if pet with Id exists 
            res.status(404).send("No pet with that Id found."); // If not, respond with message
            return; // Terminate execution
        } else { // If pet with Id does exist
            res.json(data.rows[0]); // Respond with updated record in JSON format
        }
    })
    .catch((err) => { // If query was unsuccessful
        console.error(err); // Log out error
        res.sendStatus(500); // And respond with 500 Internal Server Error
    })
})

// DELETE method that deletes a record with a given Id
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id); // Parse string into an int and store in variable 
    if(isNaN(id)) { // Verify is input is a number
        res.status(400).send("Invalid ID"); // If not, respond with message
        return; // And terminate execution 
    }

    pool.query(`DELETE FROM pet WHERE petId = $1 RETURNING *`, [id]) // Query that deletes record with a specific Id 
    .then((data) => { // If query was successful
        if(data.rows.length === 0) { // Verify if pet with Id exists 
            res.status(404).send("No pet with that Id found."); // If not, respond with message
            return; // And terminate execution
        } else { // If pet with id exists
            res.status(200).send(`Pet with id: ${id} has been deleted.`) // Respond with a 200 and message stating the deletion was successful
        }
    })
    .catch((err) => { // If query was unsuccessful 
        console.error(err); // Log error 
        res.sendStatus(500); // Respond with a 500 Internal Server Error
    })
})

return router; // Return configured router
};

export default petRoutes; // Export petRoutes so it can be utilized externally 