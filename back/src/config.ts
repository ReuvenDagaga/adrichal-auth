import dotenv from 'dotenv';
import env from 'env-var';

dotenv.config();

export const config = {
  service: {
    port: env.get('PORT').default(3000).asPortNumber(),
  },
  mongo: {
    uri: env.get('MONGO_URI').required().asString(),
  },
  jwt: {
    secret: env.get('JWT_SECRET').required().asString(),
  },
  cloudinary: {
    cloudName: env.get('CLOUDINARY_CLOUD_NAME').required().asString(),
    apiKey: env.get('CLOUDINARY_API_KEY').required().asString(),
    apiSecret: env.get('CLOUDINARY_API_SECRET').required().asString(),
  },
  authMicroservice: {
    url: env.get('AUTH_MICROSERVICE_URL').required().asString(),
  },
  frontendUrl: env.get('FRONTEND_URL').default('http://localhost:5173').asString(),
  backendUrl: env.get('BACKEND_URL').default('http://localhost:3000').asString(),
  superAdmin: {
    domains: env.get('SUPER_ADMIN_DOMAINS').default('').asArray(','),
    emails: env.get('SUPER_ADMIN_EMAILS').default('').asArray(','),
  },
};
