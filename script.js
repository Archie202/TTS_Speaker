const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');
const languageSelect = document.getElementById('language-select');
const pitchInput = document.getElementById('pitch');
const rateInput = document.getElementById('rate');
const speakBtn = document.getElementById('speak-btn');
const downloadBtn = document.getElementById('download-btn');
const testVoiceBtn = document.getElementById('test-voice-btn');
const audio = document.getElementById('audio');

let voices = [];
const synth = window.speechSynthesis;
let audioUrl = '';

const populateVoiceList = () => {
    voices = synth.getVoices().sort((a, b) => a.name.localeCompare(b.name));
    voiceSelect.innerHTML = voices.map((voice, index) => `<option value="${index}">${voice.name} (${voice.lang})</option>`).join('');

    const languages = [...new Set(voices.map(voice => voice.lang))];
    languageSelect.innerHTML = languages.map(language => `<option value="${language}">${language}</option>`).join('');
};

populateVoiceList();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = populateVoiceList;
}

const updatePitchValue = () => {
    document.getElementById('pitch-value').textContent = pitchInput.value;
};

const updateRateValue = () => {
    document.getElementById('rate-value').textContent = rateInput.value;
};

pitchInput.addEventListener('input', updatePitchValue);
rateInput.addEventListener('input', updateRateValue);

speakBtn.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance(textInput.value);
    const selectedVoice = voices[voiceSelect.value];
    utterance.voice = selectedVoice;
    utterance.lang = languageSelect.value;
    utterance.pitch = parseFloat(pitchInput.value);
    utterance.rate = parseFloat(rateInput.value);
    synth.speak(utterance);
});

testVoiceBtn.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance('Testing selected voice.');
    utterance.voice = voices[voiceSelect.value];
    utterance.lang = languageSelect.value;
    utterance.pitch = parseFloat(pitchInput.value);
    utterance.rate = parseFloat(rateInput.value);
    synth.speak(utterance);
});

downloadBtn.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance(textInput.value);
    utterance.voice = voices[voiceSelect.value];
    utterance.lang = languageSelect.value;
    utterance.pitch = parseFloat(pitchInput.value);
    utterance.rate = parseFloat(rateInput.value);

    // Generate audio and handle playback and download
    const audioChunks = [];
    const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
    audioUrl = URL.createObjectURL(audioBlob);

    utterance.onstart = () => {
        console.log('Speech started');
    };

    utterance.onend = () => {
        audio.src = audioUrl;
        audio.controls = true;
        audio.load();
    };

    utterance.onaudioprocess = (event) => {
        audioChunks.push(event.inputBuffer.getChannelData(0));
    };

    synth.speak(utterance);
});

// Handle audio playback in the audio element
audio.addEventListener('ended', () => {
    console.log('Playback ended');
});

audio.addEventListener('error', (event) => {
    console.error('Audio error:', event);
});
