require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const swaggerUi = require('swagger-ui-express');

const app = express();
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'garrafaya', user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD, max: 15, idleTimeoutMillis: 30000
});
app.use(helmet());
app.use(cors({origin: process.env.CORS_ORIGIN || '*'}));
app.use(express.json({limit:'1mb'}));
app.use('/api/v1/auth', rateLimit({windowMs:15*60*1000, limit:30}));

const asyncHandler = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
const httpError = (status, message) => Object.assign(new Error(message), { status });
const isPositiveId = value => (typeof value === 'number' && Number.isSafeInteger(value) && value > 0)
  || (typeof value === 'string' && /^[1-9]\d*$/.test(value));
const resourceMap = {
 roles:{table:'roles',pk:['id']}, permissions:{table:'permissions',pk:['id']},
 users:{table:'users',pk:['id'],hidden:['password_hash']},
 customers:{table:'customers',pk:['id']}, customer_contacts:{table:'customer_contacts',pk:['id']},
 customer_addresses:{table:'customer_addresses',pk:['id']}, products:{table:'products',pk:['id']},
 warehouses:{table:'warehouses',pk:['id']}, inventory:{table:'inventory',pk:['id']},
 inventory_movements:{table:'inventory_movements',pk:['id']}, vehicles:{table:'vehicles',pk:['id']},
 vehicle_maintenance:{table:'vehicle_maintenance',pk:['id']}, staff:{table:'staff',pk:['id']},
 driver_licenses:{table:'driver_licenses',pk:['id']}, routes:{table:'routes',pk:['id']},
 route_stops:{table:'route_stops',pk:['id']}, orders:{table:'orders',pk:['id']},
 order_details:{table:'order_details',pk:['id']}, dispatches:{table:'dispatches',pk:['id']},
 payments:{table:'payments',pk:['id']}, incidents:{table:'incidents',pk:['id']},
 access_logs:{table:'access_logs',pk:['id']}, audit_logs:{table:'audit_logs',pk:['id']}
};
const endpointCatalog = [
 {method:'GET',path:'/api/v1/health',description:'Verifica el estado de la API y la conexión a PostgreSQL',auth:false},
 {method:'POST',path:'/api/v1/auth/login',description:'Inicia sesión y devuelve un token Bearer',auth:false},
 {method:'GET',path:'/api/v1/auth/me',description:'Consulta el perfil del usuario autenticado',auth:true}
];
for (const resource of Object.keys(resourceMap)) {
 if (resource === 'users') {
  endpointCatalog.push(
   {method:'GET',path:'/api/v1/users',description:'Lista usuarios',auth:true},
   {method:'GET',path:'/api/v1/users/:id',description:'Consulta un usuario',auth:true},
   {method:'POST',path:'/api/v1/users',description:'Crea un usuario',auth:true},
   {method:'PATCH',path:'/api/v1/users/:id/password',description:'Cambia la contraseña de un usuario',auth:true}
  );
  continue;
 }
 const readOnly = ['inventory','inventory_movements','access_logs','audit_logs'].includes(resource);
 endpointCatalog.push(
  {method:'GET',path:`/api/v1/${resource}`,description:`Lista ${resource}`,auth:true},
  {method:'GET',path:`/api/v1/${resource}/:id`,description:`Consulta un registro de ${resource}`,auth:true}
 );
 if (!readOnly) {
  endpointCatalog.push(
   {method:'POST',path:`/api/v1/${resource}`,description:`Crea un registro de ${resource}`,auth:true},
   {method:'PUT',path:`/api/v1/${resource}/:id`,description:`Actualiza un registro de ${resource}`,auth:true}
  );
  if (!['roles','permissions'].includes(resource)) {
   endpointCatalog.push({method:'DELETE',path:`/api/v1/${resource}/:id`,description:`Elimina un registro de ${resource}`,auth:true});
  }
 }
}
endpointCatalog.push(
 {method:'POST',path:'/api/v1/orders-advanced',description:'Crea un pedido y sus detalles en una transacción',auth:true},
 {method:'POST',path:'/api/v1/inventory-movements-advanced',description:'Registra entradas/salidas y actualiza las existencias',auth:true},
 {method:'GET',path:'/api/v1/users/:userId/roles',description:'Consulta los roles de un usuario',auth:true},
 {method:'POST',path:'/api/v1/users/:userId/roles/:roleId',description:'Asigna un rol a un usuario',auth:true},
 {method:'DELETE',path:'/api/v1/users/:userId/roles/:roleId',description:'Retira un rol de un usuario',auth:true},
 {method:'GET',path:'/api/v1/roles/:roleId/permissions',description:'Consulta los permisos de un rol',auth:true},
 {method:'POST',path:'/api/v1/roles/:roleId/permissions/:permissionId',description:'Asigna un permiso a un rol',auth:true},
 {method:'DELETE',path:'/api/v1/roles/:roleId/permissions/:permissionId',description:'Retira un permiso de un rol',auth:true}
);
const openApiPaths = {};
for (const endpoint of endpointCatalog) {
 const path = endpoint.path.replace(/:([A-Za-z0-9_]+)/g, '{$1}');
 const method = endpoint.method.toLowerCase();
 const operation = {
  tags:[path.split('/')[3] || 'general'],
  summary:endpoint.description,
  operationId:`${method}_${path.replace(/[{}]/g,'').replace(/[^A-Za-z0-9]+/g,'_')}`,
  security:endpoint.auth ? [{bearerAuth:[]}] : [],
  responses:{
   200:{description:'Solicitud procesada correctamente'},
   400:{description:'Solicitud inválida'},
   401:{description:'Token ausente o inválido'},
   404:{description:'Recurso o registro no encontrado'},
   500:{description:'Error interno del servidor'}
  }
 };
 const pathParameters = [...path.matchAll(/\{([^}]+)\}/g)].map(match => ({
  name:match[1],in:'path',required:true,schema:{type:'string'},description:`Identificador: ${match[1]}`
 }));
 if (pathParameters.length) operation.parameters = pathParameters;
 if (method === 'get' && path.split('/').length === 4) {
  operation.parameters = [...(operation.parameters || []),
   {name:'limit',in:'query',required:false,schema:{type:'integer',minimum:1,maximum:500,default:100}},
   {name:'offset',in:'query',required:false,schema:{type:'integer',minimum:0,default:0}}
  ];
 }
 if (method === 'post' || method === 'put' || method === 'patch') {
  let schema = {$ref:'#/components/schemas/GenericWrite'};
  if (path === '/api/v1/auth/login') schema = {$ref:'#/components/schemas/LoginRequest'};
  else if (path === '/api/v1/users') schema = {$ref:'#/components/schemas/UserCreateRequest'};
  else if (path === '/api/v1/users/{id}/password') schema = {$ref:'#/components/schemas/PasswordUpdateRequest'};
  else if (path === '/api/v1/orders-advanced') schema = {$ref:'#/components/schemas/OrderCreateRequest'};
  else if (path === '/api/v1/inventory-movements-advanced') schema = {$ref:'#/components/schemas/InventoryMovementRequest'};
  operation.requestBody = {
   required:true,
   content:{'application/json':{schema}}
  };
 }
 if (method === 'post' && path !== '/api/v1/auth/login') operation.responses[201] = {description:'Registro creado correctamente'};
 if (!openApiPaths[path]) openApiPaths[path] = {};
 openApiPaths[path][method] = operation;
}
const openApiSpec = {
 openapi:'3.0.3',
 info:{
  title:'GarrafaYa API REST',
  version:'1.0.0',
  description:'Documentación interactiva de la API. Inicia sesión en /api/v1/auth/login y usa el token con el botón Authorize.'
 },
 servers:[{url:'/',description:'Servidor local'}],
 tags:[...new Set(endpointCatalog.map(endpoint => endpoint.path.split('/')[3] || 'general'))]
  .map(name => ({name})),
 paths:openApiPaths,
 components:{
  securitySchemes:{bearerAuth:{type:'http',scheme:'bearer',bearerFormat:'JWT'}},
  schemas:{
   GenericWrite:{type:'object',additionalProperties:true,description:'Campos definidos por el esquema de base de datos.'},
   LoginRequest:{type:'object',required:['login','password'],properties:{
    login:{type:'string',example:'admin@garrafaya.bo'},password:{type:'string',format:'password',example:'GarrafaYa2026!'}
   }},
   UserCreateRequest:{type:'object',required:['username','email','password'],properties:{
    username:{type:'string',example:'operador1'},email:{type:'string',format:'email',example:'operador@garrafaya.bo'},
    password:{type:'string',format:'password',minLength:8,example:'Cambiar123!'}
   }},
   PasswordUpdateRequest:{type:'object',required:['password'],properties:{
    password:{type:'string',format:'password',minLength:8,example:'NuevaClave123!'}
   }},
   OrderCreateRequest:{type:'object',required:['customer_id','products'],properties:{
    customer_id:{type:'integer',minimum:1,example:1},
    products:{type:'array',minItems:1,items:{type:'object',required:['product_id','quantity','unit_price'],properties:{
     product_id:{type:'integer',minimum:1,example:1},quantity:{type:'integer',minimum:1,example:3},
     unit_price:{type:'number',minimum:0,example:22.5}
    }}}
   }},
   InventoryMovementRequest:{type:'object',required:['product_id','warehouse_id','movement_type','quantity'],properties:{
    product_id:{type:'integer',minimum:1,example:1},warehouse_id:{type:'integer',minimum:1,example:1},
    movement_type:{type:'string',enum:['entry','exit'],example:'entry'},quantity:{type:'integer',minimum:1,example:50}
   }}
  }
 }
};
app.use('/api-docs',helmet.contentSecurityPolicy({directives:{
 defaultSrc:["'self'"],scriptSrc:["'self'","'unsafe-inline'"],styleSrc:["'self'","'unsafe-inline'"],
 imgSrc:["'self'",'data:'],connectSrc:["'self'"],objectSrc:["'none'"],baseUri:["'self'"]
}}));
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(openApiSpec,{
 explorer:true,
 customSiteTitle:'GarrafaYa API - Swagger',
 swaggerOptions:{persistAuthorization:false,tryItOutEnabled:true}
}));
app.get('/api-docs.json',(req,res)=>res.json(openApiSpec));
const endpointRows = endpointCatalog.map(endpoint => `
 <tr><td><strong>${endpoint.method}</strong></td>
 <td><code>${endpoint.path}</code></td><td>${endpoint.description}</td>
 <td>${endpoint.auth ? 'Token Bearer' : 'Público'}</td></tr>`).join('');
app.get('/',(req,res)=>{
 res.type('html').send(`<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>GarrafaYa API | Endpoints</title>
 </head><body>
<h1>GarrafaYa API</h1><p>API REST para clientes, pedidos, inventario, logística y usuarios.</p>
<h2>Empezar</h2><p>Base de la API: <code>/api/v1</code>. Las rutas protegidas requieren <code>Authorization: Bearer &lt;token&gt;</code>.</p>
<p><a href="/api-docs/">Abrir Swagger UI</a> | <a href="/api/v1/health">Probar conexión y base de datos</a> | <a href="/api/v1">Ver índice JSON</a></p>
<p>Inicia sesión con <code>POST /api/v1/auth/login</code> enviando <code>{"login":"admin@garrafaya.bo","password":"..."}</code>.</p>
<h2>Endpoints disponibles (${endpointCatalog.length})</h2><table border="1" cellpadding="8" cellspacing="0"><thead><tr><th>Método</th><th>Endpoint</th><th>Descripción</th><th>Acceso</th></tr></thead><tbody>${endpointRows}</tbody></table>
<p>Los movimientos de inventario se realizan únicamente mediante el endpoint transaccional, para conservar el historial y el stock sincronizados.</p>
</body></html>`);
});
app.get('/api/v1',(req,res)=>{
 res.json({
  name:'GarrafaYa API',
  version:'1.0.0',
  basePath:'/api/v1',
  authentication:'Usa Authorization: Bearer <token> en las rutas protegidas.',
  endpoints:endpointCatalog
 });
});
function auth(req,res,next){
 const h=req.headers.authorization||'';
 if(!h.startsWith('Bearer ')) return res.status(401).json({message:'Token requerido'});
 try { req.user=jwt.verify(h.slice(7),process.env.JWT_SECRET); next(); }
 catch { return res.status(401).json({message:'Token inválido o expirado'}); }
}
async function logAccess(userId,action,queryable=pool){
 await queryable.query('INSERT INTO access_logs(user_id,action) VALUES($1,$2)',[userId,action]);
 await queryable.query('INSERT INTO audit_logs(user_id,operation,details) VALUES($1,$2,$3)',[userId,action,'API REST']);
}
app.get('/api/v1/health',asyncHandler(async(req,res)=>{
 await pool.query('SELECT 1'); res.json({status:'ok',database:'connected',service:'GarrafaYa API'});
}));
app.post('/api/v1/auth/login',asyncHandler(async(req,res)=>{
 const {login,password}=req.body||{};
 if(!login||!password) return res.status(400).json({message:'login y password son obligatorios'});
 const q=await pool.query(`SELECT u.id,u.username,u.email,u.password_hash,
   COALESCE(json_agg(DISTINCT r.name) FILTER(WHERE r.name IS NOT NULL),'[]') roles
   FROM users u LEFT JOIN user_roles ur ON ur.user_id=u.id LEFT JOIN roles r ON r.id=ur.role_id
   WHERE u.username=$1 OR u.email=$1 GROUP BY u.id`,[login]);
 if(!q.rowCount || !(await bcrypt.compare(password,q.rows[0].password_hash)))
   return res.status(401).json({message:'Credenciales incorrectas'});
 const u=q.rows[0];
 const token=jwt.sign({id:u.id,username:u.username,email:u.email,roles:u.roles},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||'8h'});
 await logAccess(u.id,'LOGIN');
 res.json({token,tokenType:'Bearer',expiresIn:process.env.JWT_EXPIRES_IN||'8h',user:{id:u.id,username:u.username,email:u.email,roles:u.roles}});
}));
app.get('/api/v1/auth/me',auth,asyncHandler(async(req,res)=>{
 const q=await pool.query(`SELECT u.id,u.username,u.email,COALESCE(json_agg(DISTINCT r.name) FILTER(WHERE r.name IS NOT NULL),'[]') roles
 FROM users u LEFT JOIN user_roles ur ON ur.user_id=u.id LEFT JOIN roles r ON r.id=ur.role_id WHERE u.id=$1 GROUP BY u.id`,[req.user.id]);
 if(!q.rowCount) return res.status(404).json({message:'Usuario no encontrado'});
 res.json(q.rows[0]);
}));

// Crear usuario con hash seguro (el hash nunca se devuelve).
app.post('/api/v1/users',auth,asyncHandler(async(req,res)=>{
 const {username,email,password}=req.body||{};
 if(!username||!email||!password) return res.status(400).json({message:'username, email y password son obligatorios'});
 if(password.length<8) return res.status(400).json({message:'La contraseña debe tener al menos 8 caracteres'});
 const hash=await bcrypt.hash(password,12);
 const q=await pool.query('INSERT INTO users(username,email,password_hash) VALUES($1,$2,$3) RETURNING id,username,email,created_at,updated_at',[username,email,hash]);
 await logAccess(req.user.id,'CREATE_USER');
 res.status(201).json(q.rows[0]);
}));
app.patch('/api/v1/users/:id/password',auth,asyncHandler(async(req,res)=>{
 const {password}=req.body||{};
 if(!password||password.length<8) return res.status(400).json({message:'La nueva contraseña debe tener al menos 8 caracteres'});
 const hash=await bcrypt.hash(password,12);
 const q=await pool.query('UPDATE users SET password_hash=$1,updated_at=now() WHERE id=$2 RETURNING id,username,email',[hash,req.params.id]);
 if(!q.rowCount) return res.status(404).json({message:'Usuario no encontrado'});
 await logAccess(req.user.id,'CHANGE_USER_PASSWORD'); res.json(q.rows[0]);
}));


// Relaciones N:M: asignar/quitar roles a usuarios y permisos a roles.
app.get('/api/v1/users/:userId/roles',auth,asyncHandler(async(req,res)=>{
 const q=await pool.query(`SELECT r.id,r.name,r.description FROM roles r
 JOIN user_roles ur ON ur.role_id=r.id WHERE ur.user_id=$1 ORDER BY r.name`,[req.params.userId]);
 res.json(q.rows);
}));
app.post('/api/v1/users/:userId/roles/:roleId',auth,asyncHandler(async(req,res)=>{
 await pool.query('INSERT INTO user_roles(user_id,role_id) VALUES($1,$2) ON CONFLICT DO NOTHING',[req.params.userId,req.params.roleId]);
 await logAccess(req.user.id,'ASSIGN_USER_ROLE'); res.status(201).json({message:'Rol asignado al usuario'});
}));
app.delete('/api/v1/users/:userId/roles/:roleId',auth,asyncHandler(async(req,res)=>{
 const q=await pool.query('DELETE FROM user_roles WHERE user_id=$1 AND role_id=$2 RETURNING user_id',[req.params.userId,req.params.roleId]);
 if(!q.rowCount) return res.status(404).json({message:'Asignación no encontrada'});
 await logAccess(req.user.id,'REMOVE_USER_ROLE'); res.json({message:'Rol retirado del usuario'});
}));
app.get('/api/v1/roles/:roleId/permissions',auth,asyncHandler(async(req,res)=>{
 const q=await pool.query(`SELECT p.id,p.name,p.description FROM permissions p
 JOIN role_permissions rp ON rp.permission_id=p.id WHERE rp.role_id=$1 ORDER BY p.name`,[req.params.roleId]);
 res.json(q.rows);
}));
app.post('/api/v1/roles/:roleId/permissions/:permissionId',auth,asyncHandler(async(req,res)=>{
 await pool.query('INSERT INTO role_permissions(role_id,permission_id) VALUES($1,$2) ON CONFLICT DO NOTHING',[req.params.roleId,req.params.permissionId]);
 await logAccess(req.user.id,'ASSIGN_ROLE_PERMISSION'); res.status(201).json({message:'Permiso asignado al rol'});
}));
app.delete('/api/v1/roles/:roleId/permissions/:permissionId',auth,asyncHandler(async(req,res)=>{
 const q=await pool.query('DELETE FROM role_permissions WHERE role_id=$1 AND permission_id=$2 RETURNING role_id',[req.params.roleId,req.params.permissionId]);
 if(!q.rowCount) return res.status(404).json({message:'Asignación no encontrada'});
 await logAccess(req.user.id,'REMOVE_ROLE_PERMISSION'); res.json({message:'Permiso retirado del rol'});
}));

// CRUD genérico controlado por lista blanca. Usa parámetros SQL y no acepta nombres de tabla del cliente.
app.use('/api/v1',auth);
app.get('/api/v1/:resource',asyncHandler(async(req,res)=>{
 const cfg=resourceMap[req.params.resource]; if(!cfg) return res.status(404).json({message:'Recurso no disponible'});
 const limit=Math.min(Math.max(parseInt(req.query.limit||'100',10)||100,1),500);
 const offset=Math.max(parseInt(req.query.offset||'0',10)||0,0);
 const q=await pool.query(`SELECT * FROM ${cfg.table} ORDER BY ${cfg.pk.join(',')} LIMIT $1 OFFSET $2`,[limit,offset]);
 const rows=q.rows.map(row=>{if(cfg.hidden) cfg.hidden.forEach(k=>delete row[k]);return row;});
 res.json({data:rows,pagination:{limit,offset,count:rows.length}});
}));
app.get('/api/v1/:resource/:id',asyncHandler(async(req,res)=>{
 const cfg=resourceMap[req.params.resource]; if(!cfg) return res.status(404).json({message:'Recurso no disponible'});
 const q=await pool.query(`SELECT * FROM ${cfg.table} WHERE ${cfg.pk[0]}=$1`,[req.params.id]);
 if(!q.rowCount) return res.status(404).json({message:'Registro no encontrado'});
 const row=q.rows[0]; if(cfg.hidden) cfg.hidden.forEach(k=>delete row[k]); res.json(row);
}));
app.post('/api/v1/:resource',asyncHandler(async(req,res)=>{
 const cfg=resourceMap[req.params.resource]; if(!cfg) return res.status(404).json({message:'Recurso no disponible'});
 if(['users','access_logs','audit_logs','inventory','inventory_movements'].includes(cfg.table)) return res.status(403).json({message:'Utiliza el endpoint específico'});
 const entries=Object.entries(req.body||{});
 if(!entries.length) return res.status(400).json({message:'Envía al menos un campo'});
 const cols=entries.map(([k])=>k);
 if(cols.some(k=>! /^[a-z_][a-z0-9_]*$/.test(k))) return res.status(400).json({message:'Nombre de campo inválido'});
 const vals=entries.map(([,v])=>v);
 const placeholders=vals.map((_,i)=>`$${i+1}`);
 const sql=`INSERT INTO ${cfg.table}(${cols.join(',')}) VALUES(${placeholders.join(',')}) RETURNING *`;
 const q=await pool.query(sql,vals); const row=q.rows[0]; if(cfg.hidden) cfg.hidden.forEach(k=>delete row[k]);
 await logAccess(req.user.id,`CREATE_${cfg.table.toUpperCase()}`); res.status(201).json(row);
}));
app.put('/api/v1/:resource/:id',asyncHandler(async(req,res)=>{
 const cfg=resourceMap[req.params.resource]; if(!cfg) return res.status(404).json({message:'Recurso no disponible'});
 if(['users','access_logs','audit_logs','inventory','inventory_movements'].includes(cfg.table)) return res.status(403).json({message:'Recurso protegido'});
 const entries=Object.entries(req.body||{}); if(!entries.length) return res.status(400).json({message:'Envía campos para actualizar'});
 if(entries.some(([k])=>! /^[a-z_][a-z0-9_]*$/.test(k))) return res.status(400).json({message:'Nombre de campo inválido'});
 const sets=entries.map(([k],i)=>`${k}=$${i+1}`).join(',');
 const vals=entries.map(([,v])=>v); vals.push(req.params.id);
 const q=await pool.query(`UPDATE ${cfg.table} SET ${sets} WHERE ${cfg.pk[0]}=$${vals.length} RETURNING *`,vals);
 if(!q.rowCount) return res.status(404).json({message:'Registro no encontrado'});
 const row=q.rows[0]; if(cfg.hidden) cfg.hidden.forEach(k=>delete row[k]);
 await logAccess(req.user.id,`UPDATE_${cfg.table.toUpperCase()}`); res.json(row);
}));
app.delete('/api/v1/:resource/:id',asyncHandler(async(req,res)=>{
 const cfg=resourceMap[req.params.resource]; if(!cfg) return res.status(404).json({message:'Recurso no disponible'});
 if(['users','roles','permissions','user_roles','role_permissions','access_logs','audit_logs','inventory','inventory_movements'].includes(cfg.table))
   return res.status(403).json({message:'Eliminación restringida para este recurso'});
 const q=await pool.query(`DELETE FROM ${cfg.table} WHERE ${cfg.pk[0]}=$1 RETURNING ${cfg.pk[0]}`,[req.params.id]);
 if(!q.rowCount) return res.status(404).json({message:'Registro no encontrado'});
 await logAccess(req.user.id,`DELETE_${cfg.table.toUpperCase()}`); res.json({message:'Registro eliminado',id:q.rows[0].id});
}));

// =========================================================================
// ENDPOINTS AVANZADOS DE NEGOCIO (LOGICA TRANSACCIONAL DE GARRAFAYA)
// =========================================================================

// A. Crear un Pedido Completo con sus Detalles en una sola Transacción Segura
app.post('/api/v1/orders-advanced', auth, asyncHandler(async (req, res) => {
    const { customer_id, products } = req.body || {};
    if (!isPositiveId(customer_id) || !Array.isArray(products) || products.length === 0) {
        throw httpError(400, 'Se requiere un customer_id válido y al menos un producto.');
    }
    if (products.some(item => !item || !isPositiveId(item.product_id)
        || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 2147483647
        || typeof item.unit_price !== 'number' || !Number.isFinite(item.unit_price) || item.unit_price < 0)) {
        throw httpError(400, 'Cada producto requiere product_id válido, quantity entero positivo y unit_price no negativo.');
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Iniciar bloque transaccional en Postgres Docker

        // 1. Insertar la Cabecera de la Orden (Inicia en estado 'pending')
        const orderRes = await client.query(
            `INSERT INTO orders (customer_id, status, order_date) VALUES ($1, 'pending', now()) RETURNING id, status, order_date`,
            [customer_id]
        );
        const newOrder = orderRes.rows[0];

        const insertedDetails = [];

        // 2. Insertar los productos al detalle de la orden uno por uno de forma segura
        for (const item of products) {
            const { product_id, quantity, unit_price } = item;
            const detailRes = await client.query(
                `INSERT INTO order_details (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4) RETURNING id, product_id, quantity, unit_price`,
                [newOrder.id, product_id, quantity, unit_price]
            );
            insertedDetails.push(detailRes.rows[0]);
        }

        // 3. Confirmar los cambios en la base de datos de Docker
        await logAccess(req.user.id, `CREATE_ORDER_ADVANCED_ID_${newOrder.id}`, client);
        await client.query('COMMIT');

        res.status(201).json({
            message: 'Pedido y detalles procesados con éxito transaccional',
            order: newOrder,
            details: insertedDetails
        });

    } catch (error) {
        try {
            await client.query('ROLLBACK');
        } catch (rollbackError) {
            console.error('Error al revertir la transacción del pedido:', rollbackError);
        }
        throw error;
    } finally {
        client.release(); // Liberar la conexión al pool de Docker
    }
}));

// B. Registrar Movimiento Logístico y Actualizar el Stock de Garrafas Automáticamente
app.post('/api/v1/inventory-movements-advanced', auth, asyncHandler(async (req, res) => {
    const { product_id, warehouse_id, movement_type, quantity } = req.body || {};
    if (!isPositiveId(product_id) || !isPositiveId(warehouse_id)
        || !['entry', 'exit'].includes(movement_type)
        || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 2147483647) {
        throw httpError(400, 'Se requieren product_id y warehouse_id válidos, movement_type entry o exit, y quantity entero positivo.');
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Asegurar atomicidad

        await client.query(
            `INSERT INTO inventory (product_id, warehouse_id, full_cylinders, empty_cylinders, damaged_cylinders)
             VALUES ($1, $2, 0, 0, 0) ON CONFLICT (product_id, warehouse_id) DO NOTHING`,
            [product_id, warehouse_id]
        );
        const inventoryRes = await client.query(
            'SELECT id, full_cylinders FROM inventory WHERE product_id = $1 AND warehouse_id = $2 FOR UPDATE',
            [product_id, warehouse_id]
        );
        const inventoryId = inventoryRes.rows[0].id;

        // 2. Modificar el stock según el flujo operativo de cilindros
        if (movement_type === 'entry') {
            await client.query('UPDATE inventory SET full_cylinders = full_cylinders + $1 WHERE id = $2', [quantity, inventoryId]);
        } else {
            if (inventoryRes.rows[0].full_cylinders < quantity) {
                throw httpError(409, 'Stock insuficiente de garrafas llenas en este almacén.');
            }
            await client.query('UPDATE inventory SET full_cylinders = full_cylinders - $1 WHERE id = $2', [quantity, inventoryId]);
        }

        // 3. Insertar la bitácora histórica en inventory_movements
        const movementRes = await client.query(
            'INSERT INTO inventory_movements (inventory_id, movement_type, quantity, responsible_user_id) VALUES ($1, $2, $3, $4) RETURNING id',
            [inventoryId, movement_type, quantity, req.user.id]
        );

        await logAccess(req.user.id, `LOGISTIC_MOVEMENT_INVENTORY_${inventoryId}`, client);
        await client.query('COMMIT');

        res.status(201).json({
            message: 'Movimiento logístico y stock físico actualizados con éxito en Docker',
            movementId: movementRes.rows[0].id,
            inventoryId: inventoryId
        });

    } catch (error) {
        try {
            await client.query('ROLLBACK');
        } catch (rollbackError) {
            console.error('Error al revertir el movimiento de inventario:', rollbackError);
        }
        throw error;
    } finally {
        client.release();
    }
}));








app.use((err,req,res,next)=>{
 console.error(err);
 if(err.type==='entity.parse.failed') return res.status(400).json({message:'Solicitud JSON inválida'});
 if(err.code==='23505') return res.status(409).json({message:'Ya existe un registro con ese valor único'});
 if(err.code==='23503') return res.status(400).json({message:'La referencia indicada no existe o está relacionada con otros registros'});
 if(err.code==='23514') return res.status(400).json({message:'Un campo no cumple las restricciones permitidas'});
 if(err.status && err.status >= 400 && err.status < 500) return res.status(err.status).json({message:err.message});
 res.status(500).json({message:'Error interno del servidor',detail:process.env.NODE_ENV==='development'?err.message:undefined});
});
const port=Number(process.env.PORT||80);
app.listen(port,()=>console.log(`GarrafaYa API escuchando en http://localhost:${port}`));
