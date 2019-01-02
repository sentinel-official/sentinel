var Raven = require('raven-js');
Raven.config('https://87e96235379547cbbfc156ad824afbbc@sentry.io/300870').install();

exports.sendError=(err)=>{
try{
    throw err;
} catch(e){
    Raven.captureException(e);
}
}