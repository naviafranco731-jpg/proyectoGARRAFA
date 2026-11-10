require('dotenv').config();
const bcrypt=require('bcryptjs');
const {Pool}=require('pg');
const pool=new Pool({host:process.env.DB_HOST||'localhost',port:Number(process.env.DB_PORT||5432),database:process.env.DB_NAME||'garrafaya',user:process.env.DB_USER||'postgres',password:process.env.DB_PASSWORD});
(async()=>{
 try{
  const hash=await bcrypt.hash('GarrafaYa2026!',12);
  await pool.query(`INSERT INTO roles(name,description) VALUES
   ('ADMIN','Administrador del sistema'),('OPERADOR','Operador logístico')
   ON CONFLICT(name) DO NOTHING`);
  await pool.query(`INSERT INTO permissions(name,description) VALUES
   ('users.manage','Administrar usuarios'),('inventory.manage','Administrar inventario'),
   ('orders.manage','Administrar pedidos'),('routes.manage','Administrar rutas'),
   ('reports.view','Consultar reportes') ON CONFLICT(name) DO NOTHING`);
  const q=await pool.query(`INSERT INTO users(username,email,password_hash)
   VALUES('admin','admin@garrafaya.bo',$1)
   ON CONFLICT(email) DO UPDATE SET username=EXCLUDED.username
   RETURNING id`,[hash]);
  const role=await pool.query("SELECT id FROM roles WHERE name='ADMIN'");
  await pool.query('INSERT INTO user_roles(user_id,role_id) VALUES($1,$2) ON CONFLICT DO NOTHING',[q.rows[0].id,role.rows[0].id]);
  console.log('Datos iniciales creados. Usuario: admin | correo: admin@garrafaya.bo | contraseña: GarrafaYa2026!');
 }catch(e){console.error(e);process.exitCode=1;}finally{await pool.end();}
})();
