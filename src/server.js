import http from "node:http";
import { extractQueryParams } from "./utils/extract-query-params.js";

import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res); // importado de middlewares

  const route = routes.find(route => {
    // importado de routes.js
    return route.method === method && route.path.test(url);
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    console.log(extractQueryParams(routeParams.groups.query))

    req.params = { ...routeParams.groups}

    return route.handler(req, res);
  }

  return res.writeHead(404).end("Nenhuma requisição foi identificada!");
});

server.listen( 3333 , () => {
  console.log("HTTP server is running in 'localhost:3333' 🚀");
});
