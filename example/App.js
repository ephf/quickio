function StreamOuput({ socket }) {
  let output;
  socket.on("message", (data) => {
    output.prepend(
      <p>
        <b>{data.author}:</b> {data.content}
      </p>
    );
  });
  return (output = (
    <div class="flex flex-col-reverse gap-1 box-border p-5 overflow-y-scroll grow h-0 rounded border"></div>
  ));
}

export function App() {
  const author = localStorage.author ?? prompt("What is your name?");
  localStorage.setItem("author", author);
  const socket = io("158fcade-1eb8-4183-8086-1f77b2e4688e");
  return (
    <main class="absolute inset-0 grid place-items-center bg-gray-100">
      <div class="w-2/3 max-w-[80vh] aspect-[9/10] rounded shadow bg-white border-box p-10 flex flex-col gap-2">
        <h1 class="basis-10 font-bold text-2xl text-center">Chat Room</h1>
        <StreamOuput socket={socket} />
        <div class="basis-10 relative">
          <input
            class="rounded border outline-none w-full h-full box-border px-3 pr-10"
            placeholder="Chat"
            onkeydown={async function (ev) {
              if (ev.key == "Enter") {
                ev.preventDefault();
                if (!this.value) return;
                await socket.emit("message", { author, content: this.value });
                this.value = "";
              }
            }}
          />
          <button
            class="absolute w-8 h-8 bg-blue-600 rounded grid place-items-center right-1 bottom-1"
            onclick={async () => {
              const input = document.querySelector("input");
              if (!input.value) return;
              await socket.emit("message", { author, content: input.value });
              input.value = "";
            }}
          >
            <img
              src="https://img.icons8.com/ios-glyphs/20/ffffff/filled-sent.png"
              class="translate-x-[-1px] translate-y-[1px]"
            />
          </button>
        </div>
      </div>
    </main>
  );
}
