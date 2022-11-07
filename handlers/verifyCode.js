const express = require('express');
const router = express.Router();
const verifyCode = require('../Controllers/verifyCode');
const utils = require('../helpers/utils');
const validators = require('../helpers/validators');

router.get('/', async (req, res)=>{


    /* #swagger.parameters['username'] = {
               in: 'query',
               description: 'username',
               required: true,
               
        }
        #swagger.parameters['uniqueId'] = {
               in: 'query',
               description: 'uniqueId',
               required: true,
        }
        #swagger.parameters['oldUsername'] = {
               in: 'query',
               description: 'oldUsername',
               required: true,
        }
        #swagger.parameters['totp'] = {
               in: 'query',
               description: 'totp',
               required: true,
        }
        */
    const params = req.query;
    console.log(params);
    const response = await verifyCode.loadTemplate(params);
    if(validators.isNonNullObject(response) && "render" in response){
        let templateParams = {};
        if("params" in response)
            templateParams = response.params;
        console.log(templateParams);
        res.render(response.render, templateParams)
    }
    else if(validators.isNonNullObject(response) && "redirect" in response){
        res.redirect(response.redirect)
    }
    else if(validators.isNonNullObject(response) && "status" in response){
        status = response.code;
        delete response.code;
        res.status(status).send(response);
    }
    else {
        res.send(response);
    }

});

router.post('/', async (req, res)=>{

    /* #swagger.parameters['VerifyCode'] = {
               in: 'body',
               description: 'VerifyCode',
               required: true,
               schema: { username : 'string',uniqueId : 'string',oldUsername : 'string',totp : 'string' }
        } */

    const body = req.body;
    console.log(body);
    const response = await verifyCode.formSubmit(body);

    if(validators.isNonNullObject(response) && "render" in response){
        let templateParams = {};
        if("params" in response)
            templateParams = response.params;
        res.render(response.render, templateParams)
    }
    else if(validators.isNonNullObject(response) && "redirect" in response){
        let redirect = response.redirect;
        if("params" in response){
            const params = response.params;
            redirect += "?";
            Object.keys(params).forEach(function(key) {
                const val = params[key];
                redirect += key + "=" + val + "&"
            });
        }
        res.redirect(redirect)
    }
    else if(validators.isNonNullObject(response) && "status" in response){
        status = response.code;
        delete response.code;
        res.status(status).send(response);
    }
    else {
        res.send(response);
    }
});

module.exports = router;