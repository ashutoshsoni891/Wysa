const validators = require('../helpers/validators');
const errorHandling = require('../helpers/errorHandling');
const accounts = require('../Models/Methods/accounts');
const utils = require('../helpers/utils');

const loadTemplate = async () => {
    return {"render": "signIn"}
};

const formSubmit = async (params) => {
    const areParametersValid = params => {
        return validators.isNonEmptyString(params.username)
            && validators.isNonEmptyString(params.totp);
    };

    const areParamsNonNull = (params) =>{
        return params.username
            && params.totp;
    };

    if(!(validators.isNonNullObject(params) && areParamsNonNull(params))) return errorHandling.MISSING_PARAMS;

    if(!areParametersValid(params)) return errorHandling.INVALID_PARAMS;

    const userDetails = await accounts.getTOTP(params.username, params.totp);
    console.log(userDetails);
    if(userDetails == null)
        return {"message": "Invalid TOTP!"};
    else {
        const uniqueId = userDetails.uniqueId;
        const totp = userDetails.totp;
        const isUserPorted = userDetails.dataPorted;

        const currentTOTP = utils.generateTOTP(uniqueId);
        console.log(currentTOTP);
        if(currentTOTP === totp.toString()){
            const accessToken = utils.createAccessToken({"un": params.username, "id": uniqueId});
            console.log(accessToken);
            let templateParams = {
                "nickname": params.username,
                "uniqueId": uniqueId,
                "userPorted": isUserPorted
            };
            return {"redirect": "/profilePage", "params": templateParams, "cookie": accessToken}
        }
        else {
            return {"message": "TOTP Expired!"};
        }
    }
};

exports.loadTemplate = loadTemplate;
exports.formSubmit = formSubmit;
