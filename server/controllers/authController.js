const bcrypt = require('bcryptjs');
const db = (req) => req.app.get('db');

const register = async (req, res, next) => {
    const { username, password, isAdmin } = req.body;
    
    try {
        const result = await db(req).get_user([username]);
        const existingUser = result[0];
        if (existingUser){
            return res.status(409).json('Username taken');
        } else {
            const hash = bcrypt.hashSync(password);
            const registeredUser = await db(req).register_user([isAdmin, username, hash]);
            const user = registeredUser[0];
            req.session.user = {
                isAdmin: user.is_admin,
                id: user.id,
                username: user.username
            };
            return res.status(201).send(req.session.user);
        }
    } catch (err) {
        console.log(`Error registering user: ${err}`);
    }
}

module.exports = {
    register
}