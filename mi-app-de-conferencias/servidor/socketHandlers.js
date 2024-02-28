exports.handleTranscription = (socket) => {
    // Simula recibir una transcripción y la envía al cliente
    socket.on('requestTranscription', () => {
      // Aquí integrarías la lógica para transcribir usando Whisper y luego emitir el resultado
      const fakeTranscription = "Texto transcribido de ejemplo.";
      socket.emit('transcription', fakeTranscription);
    });
  };
  