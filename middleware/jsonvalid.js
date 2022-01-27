
module.exports = function(err, req, res, next){    
    if (err instanceof SyntaxError) return res.status(400).send({ statusCode : 400, error : 'Bad Request.' , message : 'Invalid JSON format.' });
}