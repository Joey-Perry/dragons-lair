const usersOnly = (req, res, next) => {
    if(req.session.user){
        next();
    } else {
        res.status(401).send('Please log in')
    }
}

const adminsOnly = (req, res, next) => {
    if(req.session.user.isAdmin){
        next();
    } else {
        res.status(403).send('You are not an admin');
    }
}


module.exports = {
    usersOnly, adminsOnly
}