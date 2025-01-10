import { useSubscribers } from "~/utils/useSubscribers";

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Expose-Headers": "*",
    "Content-Type": "text/plain; charset=utf-8",
  });

  const id = getRouterParam(event, "id");
  const storage = useStorage("vote");
  const subscriber = useSubscribers(id);

  const eventStream = createEventStream(event);

  eventStream.onClosed(async () => {
    subscriber.remove(eventStream);

    await eventStream.close();
  });

  eventStream.push({
    id: Date.now().toString(),
    event: "connected",
    data: `Welcome! 🤘 to event vote::${id}`,
  });

  const vote = (await storage.get<{
    count: number;
  }>(id)) || {
    count: 0,
  };

  eventStream.push({
    id: Date.now().toString(),
    event: `vote::${id}`,
    data: JSON.stringify({
      id,
      ...vote,
    }),
  });

  subscriber.add(eventStream);

  return eventStream.send();
});
