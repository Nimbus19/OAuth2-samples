onmessage = function (e) {
  console.log(e.data);
  postMessage("Hello Main!");
}