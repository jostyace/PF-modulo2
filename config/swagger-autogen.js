import swaggerAutogen from 'swagger-autogen'
import path from 'path'

const outputFile = path.join(process.cwd(), './utils/swagger_output.json')
const endpointsFiles = ['../routes/categorias.routes.js', '../routes/comentarios.routes.js', '../routes/publicaciones.routes.js', '../routes/roles.routes.js', '../routes/usuarios.routes.js']

const generateSwagger = async () => {
  const autogen = swaggerAutogen()
  await autogen(outputFile, endpointsFiles)
  console.log('Swagger documentation generated successfully!')
}

generateSwagger()
