const socket = io();
let username = '';

function setUsername() {
  const input = document.getElementById('usernameInput');
  username = input.value.trim();
  if (!username) return;
  document.getElementById('overlay').style.display = 'none';
  socket.emit('join', username);
}

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!input.value.trim() || !username) return;
  socket.emit('chat message', { user: username, text: input.value });
  input.value = '';
});

socket.on('chat message', (msg) => {
  const el = document.createElement('div');
  el.textContent = `${msg.user}: ${msg.text}`;
  el.className = 'message' + (msg.user === username ? ' mine' : '');
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
});
const callBtn = document.getElementById('callBtn');
const hangupBtn = document.getElementById('hangupBtn');

let localStream, peerConnection;
const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

callBtn.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  peerConnection = new RTCPeerConnection(config);

  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  peerConnection.ontrack = event => {
    const audio = document.createElement('audio');
    audio.srcObject = event.streams[0];
    audio.autoplay = true;
    document.body.appendChild(audio);
  };

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit('webrtc-candidate', event.candidate);
    }
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit('webrtc-offer', offer);

  callBtn.style.display = 'none';
  hangupBtn.style.display = 'inline-block';
};

hangupBtn.onclick = () => {
  peerConnection.close();
  callBtn.style.display = 'inline-block';
  hangupBtn.style.display = 'none';
};

socket.on('webrtc-offer', async offer => {
  await navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    localStream = stream;
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
  });

  peerConnection = new RTCPeerConnection(config);
  peerConnection.ontrack = event => {
    const audio = document.createElement('audio');
    audio.srcObject = event.streams[0];
    audio.autoplay = true;
    document.body.appendChild(audio);
  };
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit('webrtc-candidate', event.candidate);
    }
  };

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  socket.emit('webrtc-answer', answer);
});

socket.on('webrtc-answer', async answer => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('webrtc-candidate', async candidate => {
  await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});
