// Voice Navigation Utility
export class VoiceNavigator {
  private synthesis: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private isEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.initializeVoice();
    }
  }

  private initializeVoice() {
    if (!this.synthesis) return;

    const setVoice = () => {
      const voices = this.synthesis!.getVoices();
      // Prefer English voices
      this.voice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.localService
      ) || voices[0] || null;
    };

    if (this.synthesis.getVoices().length > 0) {
      setVoice();
    } else {
      this.synthesis.onvoiceschanged = setVoice;
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled && this.synthesis) {
      this.synthesis.cancel();
    }
  }

  speak(text: string, priority: 'high' | 'normal' = 'normal') {
    if (!this.isEnabled || !this.synthesis || !text.trim()) return;

    // Cancel previous utterances for high priority messages
    if (priority === 'high') {
      this.synthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (this.voice) {
      utterance.voice = this.voice;
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    this.synthesis.speak(utterance);
  }

  announceDirection(instruction: string, distance?: string) {
    let announcement = instruction;
    if (distance) {
      announcement = `In ${distance}, ${instruction.toLowerCase()}`;
    }
    this.speak(announcement, 'high');
  }

  announceRouteStart(destination: string) {
    this.speak(`Starting navigation to ${destination}`, 'high');
  }

  announceRouteComplete() {
    this.speak('You have arrived at your destination', 'high');
  }

  announceRecalculating() {
    this.speak('Recalculating route', 'normal');
  }

  stop() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}

export const voiceNavigator = new VoiceNavigator();