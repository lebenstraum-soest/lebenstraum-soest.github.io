import { serve, ServeInit } from "https://deno.land/std/http/server.ts";
import {
  dirname,
  fromFileUrl,
  join,
  resolve,
} from "https://deno.land/std/path/mod.ts";

const __dirname = fromFileUrl(dirname(import.meta.url));
const binPath = resolve(join(__dirname, "..", "bin"));

console.info(`Serving files from "${binPath}"`);

const serveOptions: ServeInit = {
  port: 8080,
};

async function handleRequest(request: Request): Promise<Response> {
  let requestPath = new URL(request.url).pathname;
  let shouldinjectHotReloadClient = false;

  if (requestPath === "/") {
    requestPath = "/index.html";
    shouldinjectHotReloadClient = true;
  }

  if (requestPath === "/hot-reload") {
    return handleHotReloadRequest(request);
  }

  const filePath = join(binPath, requestPath);
  const fileExtension = requestPath.substring(requestPath.lastIndexOf(".") + 1);

  let file: Uint8Array | string | null = null;
  const headers: HeadersInit = {};
  let status = 200;

  try {
    file = await (shouldinjectHotReloadClient
      ? Deno.readTextFile(filePath)
      : Deno.readFile(filePath));
    headers["Content-Type"] = getContentType(fileExtension);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      status = 404;
    } else {
      status = 500;
    }
  }

  if (shouldinjectHotReloadClient && file !== null) {
    file = await injectHotReloadClient(file as string);
  }

  console.info(`(${status}) ${requestPath}`);

  return new Response(file, {
    headers,
    status,
  });
}

const sockets: Set<WebSocket> = new Set();

function handleHotReloadRequest(request: Request): Response {
  const { response, socket } = Deno.upgradeWebSocket(request);
  console.info(`Hot reload client connected.`);

  sockets.add(socket);
  socket.onclose = () => {
    sockets.delete(socket);
    console.info(`Hot reload client disconnected.`);
  };

  return response;
}

function getContentType(fileExtension: string): string {
  switch (fileExtension) {
    case "css":
      return "text/css";

    case "html":
      return "text/html; charset=UTF-8";

    case "js":
      return "text/javascript; charset=UTF-8";

    case "png":
      return "image/png";
  }

  return "text/plain";
}

async function injectHotReloadClient(html: string): Promise<string> {
  const hotReloadClient = await Deno.readTextFile(
    join(__dirname, "hot-reload-client.js")
  );

  return html.replace("</body>", `<script>${hotReloadClient}</script></body>`);
}

async function watchHotReload(): Promise<void> {
  const watcher = Deno.watchFs(binPath);

  for await (const event of watcher) {
    if (["any", "access"].includes(event.kind)) {
      continue;
    }

    for (const path of event.paths) {
      console.info(`"${path}" updated.`);
    }

    console.info(`Sending reload.`);
    sockets.forEach((socket) => {
      socket.send("reload");
    });
  }
}

serve(handleRequest, serveOptions);
watchHotReload();
