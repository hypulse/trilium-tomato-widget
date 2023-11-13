const FOCUS_DURATION = 25 * 60;
const SHORT_BREAK_DURATION = 5 * 60;
const LONG_BREAK_DURATION = 15 * 60;
const LONG_BREAK_INTERVAL = 4;

const template = `<div id="tomatoWidget" style="contain: none">
  <div class="timeDisplay"></div>
  <div class="countDisplay"></div>
  <div class="modeDisplay">
    <button id="focus" class="modeButton">Focus</button>
    <button id="shortBreak" class="modeButton">Short Break</button>
    <button id="longBreak" class="modeButton">Long Break</button>
  </div>
  <div class="switchDisplay">
    <span>Auto Start</span>
    <label class="switch">
      <input type="checkbox" id="toggleSwitch" />
      <span class="slider round"></span>
    </label>
  </div>
  <button class="skipButton">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M17.5 18q-.425 0-.713-.288T16.5 17V7q0-.425.288-.713T17.5 6q.425 0 .713.288T18.5 7v10q0 .425-.288.713T17.5 18ZM7.05 16.975q-.5.35-1.025.05t-.525-.9v-8.25q0-.6.525-.888t1.025.038l6.2 4.15q.45.3.45.825t-.45.825l-6.2 4.15Z"
      />
    </svg>
  </button>
  <button class="startButton"></button>
</div>`;

const defaultTheme = `
  #tomatoWidget {
    font-size: 16px;
    line-height: 1;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }

  input:checked + .slider {
    background-color: #2196f3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
`;

const customTheme = `
  #tomatoWidget {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    font-family: serif;
    border-top: 1px solid #0000000d;
  }

  button {
    display: inline-block;
    outline: 0;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    font-size: 0.8em;
    height: 30px;
    background-color: #0000000d;
    color: #0e0e10;
    padding: 0 10px;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #0000001a;
  }

  .timeDisplay {
    font-size: 2em;
    font-weight: bold;
  }

  .modeDisplay {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 4px;
    overflow: hidden;
  }

  .modeButton {
    border-radius: 0;
  }

  .modeButton.active {
    background-color: #9147ff;
    color: white;
    font-weight: bold;
  }

  .switchDisplay {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  input:checked + .slider {
    background-color: #9147ff;
  }

  .switchDisplay > span {
    margin-right: 5px;
    font-size: 0.8em;
  }

  .switchDisplay label {
    margin: 0;
  }

  .skipButton {
    background-color: #0000000d;
  }

  .skipButton svg {
    width: 20px;
    height: 20px;
  }

  .startButton {
    font-weight: bold;
    padding: 0 20px;
  }
`;

module.exports = {
  FOCUS_DURATION,
  SHORT_BREAK_DURATION,
  LONG_BREAK_DURATION,
  LONG_BREAK_INTERVAL,
  template,
  theme: defaultTheme + customTheme,
};
