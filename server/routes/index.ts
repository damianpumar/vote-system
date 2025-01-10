export default eventHandler((event) => {
  setResponseHeaders(event, {
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Expose-Headers": "*",
    "Content-Type": "text/plain; charset=utf-8",
  });

  return "This is a vote system for conferences 🎤";
});
