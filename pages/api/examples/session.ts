// This is an example of how to access a session from an API route
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  res.send(JSON.stringify(session, null, 2))


  // const session = await getServerSession(req, res, authOptions);
  // // Check if session is active.
  // if (!session) {
  //   res.status(401).json({ error: "Unauthorized" })
  //   return
  // }

  // // Check if active session is expired.
  // const expires = new Date(session.expires)
  // if (expires.getTime() < Date.now()) {
  //   // Check if session is idle.
  //   const lastAccessed = new Date(session.user.lastAccessedAt)
  //   const idleTime = Date.now() - lastAccessed.getTime()
  //   if (idleTime < 5 * 60 * 1000) { // Refresh token if idle time is less than 5 minutes.
  //     const refreshedSession = await getServerSession({ req, refresh: true })
  //     res.status(200).json(refreshedSession)
  //     return
  //   }
  // }
}



// export default async function handler(req, res) {
//   const session = await getSession({ req })
//   // Check if session is active.
//   if (!session) {
//     res.status(401).json({ error: "Unauthorized" })
//     return
//   }

//   // Check if active session is expired.
//   const expires = new Date(session.expires)
//   if (expires.getTime() < Date.now()) {
//     // Check if session is idle.
//     const lastAccessed = new Date(session.user.lastAccessedAt)
//     const idleTime = Date.now() - lastAccessed.getTime()
//     if (idleTime < 5 * 60 * 1000) { // Refresh token if idle time is less than 5 minutes.
//       const refreshedSession = await getSession({ req, refresh: true })
//       res.status(200).json(refreshedSession)
//       return
//     }
//   }

//   // Proceed with business logic if session is still active or idle time exceeded.
//   // ...
// }