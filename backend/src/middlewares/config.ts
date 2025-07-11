import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import bodyParser from "body-parser";

import cors from "cors";

const configureMiddleware = (app: express.Express) => {
  app.use(express.json());

  app.use(compression());

  app.use(cookieParser());

  app.use(bodyParser.json());

  // Enable CORS
  app.use(
    cors({
      credentials: true,
      // ...corsOptions,
    })
  );
};

export default configureMiddleware;
