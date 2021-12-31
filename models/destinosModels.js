var pool = require('./bd');

async function getDestinos(){
    var query = 'select * from destinos';
    var rows = await pool.query(query);
    return rows;
}

async function insertDestino(obj){
    try{
        var query = "insert into destinos set ?";
        var rows = await pool.query(query,[obj]);
        return rows;
    }catch (error){
        console.log(error);
        throw error;
    }
}

async function deleteDestinoByID(id){
    var query ='delete from destinos where id= ?';
    var rows = await pool.query(query,[id]);
    return rows;
}

async function getDestinosByID(id){
    var query = 'select * from destinos where id=?';
    var rows = await pool.query(query,[id]);
    return rows[0];
}

async function modificarDestinoByID(obj, id){
    try{
        var query = 'update destinos set ? where id=?';
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}
module.exports = { getDestinos, insertDestino, deleteDestinoByID, getDestinosByID, modificarDestinoByID}








