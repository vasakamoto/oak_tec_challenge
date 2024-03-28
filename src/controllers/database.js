import sqlite3 from "sqlite3";

const sqlite = sqlite3.verbose();

async function connectDB() {
    return new Promise((resolve, reject) => {
        const db = new sqlite.Database("./products.db", (err) => {
            if(err) { reject("Failed to connect to DB"); }
            resolve(db);
        });
    });
}

async function checkColumns(table) {
    const db = await connectDB();
    const sql = `PRAGMA table_info(${table})`;
    const columns = [];
    return new Promise((resolve, reject) => {
        db.each(sql, [], (err, row) => {
            if(err) { throw err }
            columns.push(row.name);
            resolve(columns);
        });
    });
}

async function selectEverything(table) {
    const sql = `SELECT * FROM ${table}`;
    const db = await connectDB();
    const rows = [];
    return new Promise((resolve, reject) => {
        db.each(sql, [], (err, row) => {
            if(err) { throw err }
            rows.push(row);
            resolve(rows);
        });
    });
}

async function selectByID(table, idColumn, id) {
    const db = await connectDB();
    const sql = `SELECT * FROM ${table} WHERE ${idColumn} = ${id}`;
    return new Promise((resolve, reject) => {
        db.get(sql, [], (err, row) => {
            if(err) { throw err }
            resolve(row);
            })
    })
}

async function insertData(table, values) {
    const db = await connectDB();
    const columns = await checkColumns(table);
    const sql = `INSERT INTO ${table}(${columns}) VALUES (${values})`;
    return new Promise((resolve, reject) => {
        db.run(sql, [], (err) => {
        if(err) { throw err}
        resolve(`${values} inserted into ${table}`);
        });
    });
} 

async function updateData(table, values, where) {
    const db = await connectDB();
    const sql = `UPDATE ${table} SET ${values} WHERE ${where}`;
    return new Promise((resolve, reject) => {
        db.run(sql, [], (err) => {
            if(err) { throw err }
            resolve(`${values} inserted into ${where} in ${table}`);
        });
    });
}

async function deleteData(table, where) {
    const db = await connectDB();
    const sql = `DELETE FROM ${table} WHERE ${where}`;
    return new Promise((resolve, reject) => {
        db.run(sql, [], (err) => {
            if(err) { throw err }
            resolve(`Removed row where ${where} from ${table}`);
            });
        });
}


export { selectEverything, selectByID, insertData, updateData, deleteData };

