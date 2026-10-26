/** Minimal Server-Sent Events reader: yields each event's joined `data:` payload. */
export async function* readSse(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  let data: string[] = [];
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += value;
      let nl: number;
      while ((nl = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, nl).replace(/\r$/, "");
        buffer = buffer.slice(nl + 1);
        if (line === "") {
          if (data.length) yield data.join("\n");
          data = [];
        } else if (line.startsWith("data:")) {
          data.push(line.slice(5).replace(/^ /, ""));
        }
        // comments (":"), event:, id:, retry: are not needed by any provider here
      }
    }
    const tail = buffer.replace(/\r$/, "");
    if (tail.startsWith("data:")) data.push(tail.slice(5).replace(/^ /, ""));
    if (data.length) yield data.join("\n");
  } finally {
    reader.releaseLock();
  }
}
