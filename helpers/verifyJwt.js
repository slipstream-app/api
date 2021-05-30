const jwt = require('jsonwebtoken');

module.exports = function verifyJwt(req, res, next) {

    var token = req.headers['authorization'];
    if (!token) {
        const ret = {
            msg: "Token não enviada"
        }
        res.status(401).send(ret);
    } else {
        var tok = token.split(' ')[1];
        jwt.verify(tok, process.env.KEY, (err, authData) => {
            if (err) {
                console.log(err)
                if (err.name == "TokenExpiredError") {
                    res.status(401).send({
                        msg: 'Token Expirado'
                    })
                } else {
                    res.status(403).send({
                        msg: 'Token Inválido'
                    })
                }

                //   res.send(new errs.NotAuthorizedError("Token Inválido"));
            } else {
                req.user = authData;
                next();
            }
        })
    }
}