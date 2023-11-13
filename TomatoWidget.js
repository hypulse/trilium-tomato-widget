const {
  FOCUS_DURATION,
  SHORT_BREAK_DURATION,
  LONG_BREAK_DURATION,
  LONG_BREAK_INTERVAL,
  template,
  theme,
} = config;

function notifyMe(title = "") {
  if (Notification && Notification.permission === "granted") {
    new Notification(title);
  } else if (Notification && Notification.permission !== "denied") {
    Notification.requestPermission(function (status) {
      if (status === "granted") {
        new Notification(title);
      }
    });
  }
  api.showMessage(title);
}

class TomatoWidget extends api.BasicWidget {
  constructor() {
    super();
    this.timer = null;
    this.mode = "focus";
    this.time = FOCUS_DURATION;
    this.count = 0;
  }

  get position() {
    return 20;
  }

  get parentWidget() {
    return "center-pane";
  }

  displayTime() {
    const pad = (n) => n.toString().padStart(2, "0");
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;
    this.$widget.find(".timeDisplay").text(`${pad(minutes)}:${pad(seconds)}`);
  }

  displayCount() {
    const intervalOffset = this.count % LONG_BREAK_INTERVAL;
    const isFocusMode = this.mode === "focus";
    const transitionPoint = isFocusMode
      ? intervalOffset
      : intervalOffset === 0
      ? LONG_BREAK_INTERVAL
      : intervalOffset;

    const symbols = [];

    for (let i = 0; i < LONG_BREAK_INTERVAL; i++) {
      let symbol;
      if (i < transitionPoint) {
        symbol = "✅";
      } else if (i <= intervalOffset && isFocusMode) {
        symbol = "📖";
      } else {
        symbol = "📚";
      }
      symbols.push(symbol);
    }

    const displayString = symbols.join(" ");
    this.$widget
      .find(".countDisplay")
      .text(
        `Cycle: ${
          Math.floor(this.count / LONG_BREAK_INTERVAL) + 1
        } ${displayString}`
      );
  }

  displayMode() {
    this.$widget.find(".modeButton").removeClass("active");
    this.$widget.find(`#${this.mode}`).addClass("active");
  }

  displayStartButton() {
    this.$widget.find(".startButton").text(this.timer ? "PAUSE" : "START");
  }

  displaySwitchButton() {
    const autoStart = !!localStorage.getItem("tomatoAutoStart");
    this.$widget.find("#toggleSwitch").prop("checked", autoStart);
  }

  startTimer() {
    clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.countDown();
    }, 1000);

    this.displayStartButton();
  }

  pauseTimer() {
    clearInterval(this.timer);
    this.timer = null;

    this.displayStartButton();
  }

  resetTimer(mode) {
    this.mode = mode;
    switch (mode) {
      case "focus":
        this.time = FOCUS_DURATION;
        break;
      case "shortBreak":
        this.time = SHORT_BREAK_DURATION;
        break;
      case "longBreak":
        this.time = LONG_BREAK_DURATION;
        break;
    }

    localStorage.setItem("tomatoTime", this.time);
    this.displayTime();
    localStorage.setItem("tomatoMode", this.mode);
    this.displayMode();

    const autoStart = !!localStorage.getItem("tomatoAutoStart");
    if (autoStart) {
      this.startTimer();
    } else {
      this.pauseTimer();
    }
  }

  completeTimer() {
    if (this.mode === "focus") {
      this.count++;
      localStorage.setItem(
        "tomatoCount",
        JSON.stringify({
          count: this.count,
          date: new Date().toISOString().slice(0, 10),
        })
      );
      this.count % LONG_BREAK_INTERVAL === 0
        ? this.resetTimer("longBreak")
        : this.resetTimer("shortBreak");
      notifyMe("Time to take a break!");
    } else {
      this.resetTimer("focus");
      notifyMe("Time to get back to work!");
    }
    this.displayCount();
  }

  countDown() {
    if (this.time > 0) {
      this.time--;
      localStorage.setItem("tomatoTime", this.time);
      this.displayTime();
    } else {
      this.completeTimer();
    }
  }

  doRender() {
    try {
      this.$widget = $(template);
      this.cssBlock(theme);

      this.$widget.find(".modeButton").click((e) => {
        this.resetTimer(e.target.id);
      });
      this.$widget.find(".startButton").click(() => {
        if (this.timer) this.pauseTimer();
        else this.startTimer();
      });
      this.$widget.find(".skipButton").click(() => {
        if (this.timer) this.completeTimer();
      });
      this.$widget.find("#toggleSwitch").click((e) => {
        const autoStart = e.target.checked;
        localStorage.setItem("tomatoAutoStart", autoStart ? "true" : "");
        this.displaySwitchButton();
      });

      this.mode = localStorage.getItem("tomatoMode") || "focus";
      this.time = localStorage.getItem("tomatoTime") || FOCUS_DURATION;
      const tomatoCount = localStorage.getItem("tomatoCount");
      if (tomatoCount) {
        const { count, date } = JSON.parse(tomatoCount);
        if (date !== new Date().toISOString().slice(0, 10)) {
          this.count = 0;
        } else {
          this.count = count;
        }
      }

      this.displayTime();
      this.displayCount();
      this.displayStartButton();
      this.displayMode();
      this.displaySwitchButton();

      const autoStart = !!localStorage.getItem("tomatoAutoStart");
      if (autoStart) {
        this.startTimer();
      } else {
        this.pauseTimer();
      }
    } catch (e) {
      this.$widget = $(
        `<div id="tomatoWidget" style="contain: none">${e.message}</div>`
      );
    }

    return this.$widget;
  }
}

module.exports = new TomatoWidget();
