import { useSubscribers } from "~/utils/useSubscribers";

const sessionPassword = "0090af9f-ceff-499d-bee1-494b0932ea14";
const sessionName = "vote";

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Expose-Headers": "*",
    "Content-Type": "text/plain; charset=utf-8",
  });

  const currentSession = await getSession(event, {
    password: sessionPassword,
    name: sessionName,
  });

  if (currentSession.data.voted) {
    return "You have already voted! 😅";
  }

  const id = getRouterParam(event, "id");
  const storage = useStorage("vote");
  const subscriber = useSubscribers(id);

  if (subscriber.empty) {
    return "This vote does not exist! 😢";
  }

  const oneHour = new Date(Date.now() + 60 * 60 * 1000);
  const session = await useSession(event, {
    password: sessionPassword,
    name: sessionName,
    cookie: {
      expires: oneHour,
    },
  });

  await session.update({
    voted: true,
  });

  const vote = (await storage.get<{
    count: number;
  }>(id)) || {
    count: 0,
  };

  vote.count += 1;

  subscriber.streams.forEach((stream) =>
    stream.push({
      id: Date.now().toString(),
      event: `vote::${id}`,
      data: JSON.stringify({
        id,
        ...vote,
      }),
    })
  );

  await storage.set(id, vote);

  return "Hello developer 🤘, thanks for voting";
});
