import http from "node:http";
import { extractQueryParams } from "./extract-query-params.js";

import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res); // importado de middlewares

  const route = routes.find((route) => {
    // importado de routes.js
    return route.method === method && route.path.test(url);
  });

  console.log(route);

  if (route) {
    const routeParams = req.url.match(route.path)

    req.params = { ...routeParams.groups}

    console.log(extractQueryParams(routeParams.groups.query))

    return route.handler(req, res);
  }

  return res.writeHead(404).end("Nenhuma requisição foi identificada!");
});

server.listen({ host: "10.0.0.176", port: 3333 }, () => {
  console.log("HTTP server is running in 'http://10.0.0.176:3333' 🚀");
});
