const electron = require('electron');
const $ = require('jquery/dist/jquery.slim');

const { ipcRenderer } = electron;

ipcRenderer.on('call:start', (e, { call, stream, id }) => {
  $('#root').append(`
    <div id="${id}" class="video-container">
      <video id="${id}-them" class="their-video" ></video>
      <video id="${id}-me" class="my-video" src="${URL.createObjectURL(
    stream
  )}" ></video>
    </div>
  `);

  if (id !== call.id) {
    console.log('Call Answered!');
    call.answer(stream);
  }

  call.on('error', err => {
    alert(err); // TODO: Handle error gracefully in call window
    ipcRenderer.send(`call:end:${id}`);
  });

  call.on('stream', clientStream => {
    $(`#${id}-them`).prop('src', URL.createObjectURL(clientStream));
  });

  call.on('close', () => {
    ipcRenderer.send(`call:end:${id}`);
    $(`${id}`).remove();
    // TODO: Close window if no other call is active
  });
});
