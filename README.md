# QuickIO

Create quick static site io connections.

```html
<script src="https://ephf.github.io/quickio/quickio.min.js"></script>
```

```js
const socket = io("optional-token");

socket.emit("message", "hello world");
socket.on("message", (message) => console.log(message)) // "hello world"
```

Tokens will default to the websites hostname.