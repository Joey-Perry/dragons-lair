const db = (req) => req.app.get('db');

const dragonTreasure = async (req, res) => {
    try {
        const treasure = await db(req).get_dragon_treasure(1);
        return res.status(200).send(treasure);
    } catch(err){
        console.log(`Error retrieving treasure: ${err}`);
    }
}


module.exports = {
    dragonTreasure
}