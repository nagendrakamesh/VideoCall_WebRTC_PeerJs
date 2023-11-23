// class PeerService {
//   constructor() {
//     if (!this.peer) {
//       this.peer = new RTCPeerConnection({
//         iceServers: [
//           {
//             urls: [
//               "stun:stun.l.google.com:19302",
//               "stun:global.stun.twilio.com:3478",
//             ],
//           },
//         ],
//       });
//     }
//   }

//   async getAnswer(offer) {
//     if (this.peer) {
//       await this.peer.setRemoteDescription(offer);
//       const ans = await this.peer.createAnswer();
//       await this.peer.setLocalDescription(new RTCSessionDescription(ans));
//       return ans;
//     }
//   }

//   async setLocalDescription(ans) {
//     if (this.peer) {
//       await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
//     }
//   }

//   async getOffer() {
//     if (this.peer) {
//       const offer = await this.peer.createOffer();
//       await this.peer.setLocalDescription(new RTCSessionDescription(offer));
//       return offer;
//     }
//   }
// }

// export default new PeerService();


class PeerService {
  constructor() {
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });

    this.peer.onnegotiationneeded = async () => {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      console.log("Sending offer:", offer);
    };

    this.peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending candidate:", event.candidate);
        // Send candidate to the remote peer
      }
    };

    this.peer.onaddstream = (event) => {
      const remoteStream = event.stream;
      console.log("Received remote stream:", remoteStream);
      // Set remote stream for display
    };
  }

  async getAnswer(offer) {
    await this.peer.setRemoteDescription(offer);
    const answer = await this.peer.createAnswer();
    await this.peer.setLocalDescription(new RTCSessionDescription(answer));
    return answer;
  }

  async setLocalDescription(ans) {
    await this.peer.setLocalDescription(new RTCSessionDescription(ans));
  }

  async getOffer() {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  }
}

export default new PeerService();
