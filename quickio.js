window.io = function (a = location.hostname) {
  if (a == "localhost" || a == "127.0.0.1") {
    console.warn(
      `You are on the "${a}" stream, this stream may collide with other streams using localhost. Try changing your key to something like \`io("${crypto.randomUUID()}")\``
    );
  }

  return new (class IO {
    #listeners = {};

    constructor() {
      let initial = false;
      new EventSource(
        `https://quickio-fb2bd-default-rtdb.firebaseio.com/${a}.json`
      ).addEventListener("put", ({ data }) => {
        if (!initial) {
          initial = true;
          return;
        }
        const { event, content } = JSON.parse(data).data;
        this.#listeners[event]?.forEach((listener) => listener(content));
      });
    }

    addEventListener(event, listener) {
      this.#listeners[event] ??= [];
      this.#listeners[event].push(listener);
      return this;
    }
    on = this.addEventListener;
    removeEventListener(event, listener) {
      this.#listeners[event] = this.#listeners[event]?.filter(
        (l) => l != listener
      );
    }

    async emit(event, content) {
      await fetch(
        `https://quickio-fb2bd-default-rtdb.firebaseio.com/${a}.json`,
        {
          method: "PUT",
          body: JSON.stringify({ event, content }),
        }
      );
    }
  })();
};
