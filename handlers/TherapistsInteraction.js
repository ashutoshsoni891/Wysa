const express = require('express');
const router = express.Router();
const TherapistsInteraction = require('../Controllers/TherapistsInteraction');
const validators = require('../helpers/validators');

router.post('/', async(req, res) => {

     /* #swagger.parameters['Therapist'] = {
               in: 'body',
               description: 'Therapist',
               required: true,
               schema: { name : 'string' }
        } */

    const body = req.body;
    console.log(body);
    const response = await TherapistsInteraction.addTherapist(body);
    console.log(typeof(response));
    if(validators.isNonNullObject(response) && "status" in response){
        status = response.code;
        delete response.code;
        res.status(status).send(response);
    }
    else{
        res.send(response);
    }
});

router.get('/', async (req, res)=>{
    const params = req.query;
    console.log(params);
    const response = await TherapistsInteraction.getAllTherapists(params);
    if(validators.isNonNullObject(response) && "status" in response){
        status = response.code;
        delete response.code;
        res.status(status).send(response);
    }
    else{
        res.send(response);
    }
});

router.get('/:uniqueId', async (req, res)=>{
    const params = req.params;
    console.log(params);
    const response = await TherapistsInteraction.getTherapist(params);
    if(validators.isNonNullObject(response) && "status" in response){
        status = response.code;
        delete response.code;
        res.status(status).send(response);
    }
    else{
        res.send(response);
    }
});

module.exports = router;