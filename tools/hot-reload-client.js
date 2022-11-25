(() => {
  let socket, reconnectionTimerId;
  const requestUrl = `${window.location.origin.replace(
    "http",
    "ws"
  )}/hot-reload`;

  function log(message) {
    console.info(`🔥 ${message}`);
  }

  function reload() {
    window.location.reload();
  }

  function connect(callback) {
    if (socket) {
      socket.close();
    }

    socket = new WebSocket(requestUrl);

    socket.addEventListener("open", () => {
      log("Connected.");
      if (callback) {
        callback();
      }
    });

    socket.addEventListener("message", (event) => {
      if (event.data === "reload") {
        log("Reloading...");
        reload();
      }
    });

    socket.addEventListener("close", () => {
      log("Reconnecting...");

      clearTimeout(reconnectionTimerId);

      reconnectionTimerId = setTimeout(() => {
        connect(refresh);
      }, 1000);
    });
  }

  connect();
})();