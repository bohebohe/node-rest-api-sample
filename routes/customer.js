exports.get = function(req,res){
    console.log("call method get");
    req.mysql.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            connection.query('SELECT * FROM customer ', function(err, rows) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                } else {
                    if (rows.length === 0){
                        res.statusCode = 204;
                    } else {
                        res.send({
                            result: 'success',
                            err:    '',
                            json:   rows,
                            length: rows.length
                        });
                    }
                    connection.release();
                }
            });
        }
    });
};
exports.find = function(req,res){
    console.log("call method find");
    req.mysql.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            console.log(req.params);
            connection.query('SELECT * FROM customer WHERE customer_id = ?', req.params.id, function(err, rows) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                } else {
                    if (rows.length === 0){
                        res.statusCode = 204;
                    } else {
                        res.send({
                            result: 'success',
                            err:    '',
                            id:     req.params.id,
                            json:   rows[0],
                            length: rows.length
                        });
                    }
                    connection.release();
                }
            });
        }
    });
};
exports.upd = function(req,res){
    req.mysql.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            connection.query('UPDATE customer SET ? WHERE customer_id='+connection.escape(req.params.id), req.body, function(err) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                } else {
                    connection.query('SELECT * FROM customer WHERE customer_id = ?', req.params.id, function(err, rows) {
                        if (err) {
                            console.error(err);
                            res.statusCode = 500;
                            res.send({
                                result: 'error',
                                err:    err.code
                            });
                        } else {
                            res.send({
                                result: 'success',
                                err:    '',
                                id:     req.params.id,
                                json:   rows[0],
                                length: rows.affectedRows
                            });
                        }
                        connection.release();
                    });
                }
            });
        }
    });
};
exports.ins = function(req,res){
    req.mysql.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            var salt = bcrypt.genSaltSync(16),
                data = req.body;
                data.password = bcrypt.hashSync(data.password, salt); // bcrypt.compareSync("my password", hash); // true
                data.salt = salt;

            connection.query('INSERT INTO customer SET ?', data, function(err, result) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                } else {
                    res.send({
                        result: 'success',
                        err:    '',
                        id:     result.insertId
                    });
                }
                connection.release();
            });
        }
    });
};

exports.del = function(req,res){

};
