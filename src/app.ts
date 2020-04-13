import { config } from 'dotenv';

config();

// External Dependencies
import bodyParser from 'body-parser';
import { cyan, magenta } from 'colors/safe';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { setUserMiddleware } from './utils/setUserMiddleware';

// Internal Dependencies

// Local Variables
const limiter = rateLimit({
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests',
  windowMs: 1 * 60 * 1000, // 1 minute
});

const {
  NODE_ENV = 'development',
  PORT = '4000',
} = process.env;

export const allowedOrigins: string[] = [];

if (NODE_ENV !== 'test') {
  /* eslint-disable no-restricted-syntax */
  console.log(`${magenta('NODE_ENV')}:          ${cyan(NODE_ENV)}`);
  console.log(`${magenta('PORT')}:              ${cyan(PORT)}`);
  /* eslint-enable no-restricted-syntax */
}

class App {
  express: Express;

  constructor() {
    this.express = express();
    this.middleware();
  }

  middleware() {
    // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // see https://expressjs.com/en/guide/behind-proxies.html
    this.express.set('trust proxy', 1);

    this.express.use(compression());
    this.express.use(express.static('public'));
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(bodyParser.json({ limit: '50mb' }));
    this.express.use(cookieParser());

    this.express.use((req, res, next) => {
      const origin = Array.isArray(req.headers.origin)
        ? req.headers.origin[0] : req.headers.origin;
      const allowed = !!origin && allowedOrigins.includes(origin);

      if (allowed) {
        res.header('Access-Control-Allow-Origin', origin);
      }
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Expose-Headers', 'X-Access-Token');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token');

      // intercepts OPTIONS method
      if (req.method === 'OPTIONS') {
        // respond with 200
        res.sendStatus(200);
      } else {
        // move on
        next();
      }
    });

    this.express.use(setUserMiddleware);

    // logger
    if (NODE_ENV !== 'test') {
      this.express.use(morgan('dev', {
        // we are logging graphql requests separetely
        skip: req => req.baseUrl === '/graphql',
      }));
    }

    if (NODE_ENV !== 'test') {
      //  apply rate limiting to all requests
      this.express.use(limiter);
    }
  }
}

export default new App().express;