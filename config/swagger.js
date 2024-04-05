import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import path from 'path'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API Documentation',
      version: '1.0.0'
    }
  },
  apis: ['./routes/categorias.routes.js', './routes/comentarios.routes.js', './routes/publicaciones.routes.js', './routes/roles.routes.js', './routes/usuarios.routes.js']
}

const swaggerSpec = swaggerJSDoc(options)

export const swaggerDocs = (app, port) => {
  const swaggerJsonPath = path.join(process.cwd(), './utils/swagger_output.json')
  console.log(swaggerJsonPath)
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get('/api/docs.json', (req, res) => {
    try {
      res.sendFile(swaggerJsonPath)
    } catch (error) {
      console.error('Error al enviar el archivo JSON de Swagger:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
  console.log('Running')
}
