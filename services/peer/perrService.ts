class PeerService {
  public peer: RTCPeerConnection | undefined;
  constructor() {
    if (!this.peer) {
      const configuration = {
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      };
      this.peer = new RTCPeerConnection(configuration);
    }
  }
  async getOffer() {
    if (this.peer) {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
    }
  }
  async getAnswer(offer) {
    if (this.peer) {
        await this.peer.setRemoteDescription(offer);
        const ans = await this.peer.createAnswer();
        await this.peer.setLocalDescription(new RTCSessionDescription(ans));
        return ans;
    }
  }
  async setLocalDescription(ans) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new PeerService();
