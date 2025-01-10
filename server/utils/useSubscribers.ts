const subscribers = {};

export const useSubscribers = (name: string) => {
  subscribers[name] = subscribers[name] || [];

  return {
    streams: [...subscribers[name]],
    empty: subscribers[name].length === 0,
    add: (stream) => subscribers[name].push(stream),
    remove: (stream) =>
      (subscribers[name] = subscribers[name].filter(
        (subscriber) => subscriber !== stream
      )),
  };
};
