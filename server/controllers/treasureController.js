const db = (req) => req.app.get('db');

const dragonTreasure = async (req, res) => {
    try {
        const treasure = await db(req).get_dragon_treasure(1);
        return res.status(200).send(treasure);
    } catch(err){
        console.log(`Error retrieving treasure: ${err}`);
    }
}

const getUserTreasure = async (req, res) => {
    const { id } = req.session.user;
    try {
        const treasure = await db(req).get_user_treasure(id);
        return res.status(200).send(treasure);
    } catch(err){
        console.log(`Error retrieving user treasure: ${err}`);
    }
}

const addUserTreasure = async (req, res) => {
    const { treasureURL } = req.body;
    const { id } = req.session.user;
    try {
        const userTreasure = await db(req).add_user_treasure([treasureURL, id]);
        return res.status(200).send(userTreasure);
    } catch(err){
        console.log(`Error adding user treasure: ${err}`);
    }
}

const getAllTreasure = async (req, res) => {
    try {
        const allTreasure = await db(req).get_all_treasure();
        return res.status(200).send(allTreasure);
    } catch(err){
        console.log(`Error retrieving all treasure: ${err}`);
    }
}


module.exports = {
    dragonTreasure, getUserTreasure, addUserTreasure, getAllTreasure
}