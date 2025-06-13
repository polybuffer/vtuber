export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: BlobPart[] = [];
  private stream: MediaStream | null = null;

  public startRecording(onStopCallback?: (audioBlob: Blob) => void): void {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        this.stream = stream;
        this.mediaRecorder = new MediaRecorder(stream);
        this.chunks = [];

        this.mediaRecorder.ondataavailable = (e) => {
          this.chunks.push(e.data);
        };

        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.chunks, { type: 'audio/webm' });
          if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
          }

          if (onStopCallback) {
            onStopCallback(audioBlob);
          } else {
            // 預設播放
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
          }
        };

        this.mediaRecorder.start();

        // 自動停止（例如5秒）
        setTimeout(() => {
          this.stopRecording();
        }, 5000);
      })
      .catch((error) => {
        console.error('[AudioRecorder] 錄音失敗:', error);
      });
  }

  public stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }
}
