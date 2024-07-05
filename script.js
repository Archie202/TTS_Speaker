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
    utterance.pitch = pitchInput.value;
    utterance.rate = rateInput.value;
    synth.speak(utterance);
});

testVoiceBtn.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance('Testing selected voice.');
    utterance.voice = voices[voiceSelect.value];
    utterance.lang = languageSelect.value;
    utterance.pitch = pitchInput.value;
    utterance.rate = rateInput.value;
    synth.speak(utterance);
});

downloadBtn.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance(textInput.value);
    utterance.voice = voices[voiceSelect.value];
    utterance.lang = languageSelect.value;
    utterance.pitch = pitchInput.value;
    utterance.rate = rateInput.value;

    utterance.onstart = () => {
        audio.src = '';
        audio.load();
    };

    utterance.onend = () => {
        const blob = new Blob([utterance], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'speech.mp3';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    synth.speak(utterance);
});
