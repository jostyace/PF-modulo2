import express from 'express'
import session from 'express-session'
import categoriasRoutes from './routes/categorias.routes.js'
import comentariosRoutes from './routes/comentarios.routes.js'
import publicacionesRoutes from './routes/publicaciones.routes.js'
import rolesRoutes from './routes/roles.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'

import { PORT } from './config/config.js'
import { swaggerDocs } from './config/swagger.js'

const app = express()

app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000,
    secure: false,
    httpOnly: true
  }
}))
app.use(express.static('public'))
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE')
  next()
})
app.use(express.json())
swaggerDocs(app, PORT)
app.use('/api', categoriasRoutes)
app.use('/api', comentariosRoutes)
app.use('/api', publicacionesRoutes)
app.use('/api', rolesRoutes)
app.use('/api', usuariosRoutes)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' })
})

app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT)
})
