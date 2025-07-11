// import express from "express";
// import responseHandler from "../handlers/response-handler";
// import { getUserByToken } from "../lib/firebase";
// import { merge } from "lodash";

// export const isAuthenticated = async (
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction
// ) => {
//   try {
//     const sessionToken = req.cookies['SONWIN-AUTH']

//     if (!sessionToken) {
//       return res.sendStatus(403)
//     }

//     const existingUser = await getUserByToken(sessionToken)

//     if (!existingUser) {
//       return res.sendStatus(403)
//     }

//     merge(req, { user: existingUser })

//     return next()
//   } catch (error) {
//     console.log(error)
//     responseHandler.error(res)
//   }
// }
