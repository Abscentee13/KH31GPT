let question = window.document.getElementById('question');
let answer = window.document.getElementById('answer');
let buttonGo = window.document.getElementById('buttonGo');
let buttonStop = window.document.getElementById('buttonStop');



class webkitSpeechRecognizer {
  constructor() {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.lang = 'uk-UA'; // Можна вказати іншу мову
    this.isRecognizing = false;
  }

  start() {
    if (!this.isRecognizing) {
      this.recognition.start();
      this.isRecognizing = true;
    }
  }

  stop() {
    if (this.isRecognizing) {
      this.recognition.stop();
      this.isRecognizing = false;
    }
  }

  onResult(callback) {
    this.recognition.onresult = function(event) {

      console.log(event.results);
      let result = event.results[0][0].transcript;
      callback(result);
    };
  }

  onError(callback) {
    this.recognition.onerror = function(event) {
      callback('Error occurred in speech recognition: ' + event.error);
    };
  }
}



const requestFunc = () => {
  if (question.innerText) {
    let message = {
      "role": "user",
      "content": `${question.innerText}`
    };

    let params = {
      "model": "gpt-3.5-turbo",
      "messages": [message]
    };

    axios.post('https://api.openai.com/v1/chat/completions', params, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log(response);
        answer.textContent = (response.data.choices[0].message.content);

        talkAnswer(response.data.choices[0].message.content);
      })
      .catch(error => {
        console.error(error);
      });
  }
};




let speechRecognizer = new webkitSpeechRecognizer();


const speech = () => {
  // buttonGo.classList.add('animate-button');
  speechRecognizer.start();
};

speechRecognizer.onResult(function(result) {
  question.textContent = result;
  talkQuestion(result);
  speechRecognizer.stop();

  // buttonGo.classList.remove('animate-button');
  // buttonGo.classList.add('no-animate-button');
  requestFunc();
});

const talkQuestion = (text) =>{
  let textToTalk = new SpeechSynthesisUtterance(text);
  // textToTalk.rate = 1.4;
  // textToTalk.pitch = 0.7;
  textToTalk.lang = 'ru-RU';
  speechSynthesis.speak(textToTalk);
}

const talkAnswer = (text) =>{
  let textToTalk = new SpeechSynthesisUtterance(text);
  // textToTalk.rate = 1.3;
  // textToTalk.pitch = 0.6;
  textToTalk.lang = 'ru-RU';
  speechSynthesis.speak(textToTalk);
}



buttonGo.addEventListener('click', speech);
