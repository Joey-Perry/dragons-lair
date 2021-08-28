const bcrypt = require('bcryptjs');
const db = (req) => req.app.get('db');

const getUser = async (req, res, next) => {
    try{
        const user = await db(req).get_user(req.body.username);
        return res.status(200).send(user);
    } catch(err) {
        console.log(`Error retrieving user: ${err}`);
    }
}

const register = async (req, res ) => {
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

const login = async (req, res ) => {
    const { username, password } = req.body;
    try {
        const foundUser = await db(req).get_user([username]);
        const user = foundUser[0];
        if (!user){
            return res.status(401).send('User not found. Please register a new user before logging in.');
        } else {
            const isAuthenticated = bcrypt.compareSync(password, user.hash);
            if (!isAuthenticated){
                return res.status(403).send('Incorrect password')
            } else {
                req.session.user = {
                    isAdmin: user.is_admin,
                    id: user.id,
                    username: user.username
                }
                return res.status(200).send(req.session.user);
            }
        }
    }catch (err){
        console.log(`Error logging in user: ${err}`);
    }
}

const logout = async (req, res) => {
    req.session.destroy();
    res.status(200).send('User logged out');
}

module.exports = {
    register, getUser, login, logout
}