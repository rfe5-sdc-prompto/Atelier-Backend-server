const Pool = require('pg').Pool;

const pool = new Pool({
  user:'postgres',
  password:'postgres',
  database: 'awsdb',
  host:'3.19.238.190',
  port:5432
})

pool.query('select * from photos where id=1').then(data=>{
  console.log(data.rows[0].id, 'database is connected')
})

module.exports = pool;