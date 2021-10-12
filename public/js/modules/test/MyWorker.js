onmessage = function (e) {
  console.log('Worker: Message received from main script');
  console.log(e.data);
  console.log('Worker: Send message back to main script');
  postMessage(["Hello ", "Main!"]);
}