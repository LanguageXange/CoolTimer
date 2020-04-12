$(document).ready(function () {
  let timerObj = {
    minutes: 0,
    seconds: 0,
    timerId: 0,
  };

  // add soundeffect
  function soundAlarm() {
    let audio = new Audio("Timer_Sound_Effect.mp3");
    let amount = 3; //play the sound 3 times

    function playSound() {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    }
    for (let i = 0; i < amount; i++) {
      setTimeout(playSound, 1200 * i);
    }
  }

  //detect changes
  function updateValue(key, value) {
    if (value < 0) {
      value = 0;
      alert("invalid");
    }
    if ((value == 0) & (value.length >= 2)) {
      value = 0;
    }
    if (key == "seconds") {
      if (value < 10) {
        value = "0" + value;
      }
      if (value > 59) {
        value = "0" + 0;
        alert("Please enter number less than 60");
      }
    }
    if (key == "minutes") {
      if ((value == 0) & (value.length > 2)) {
        value = 0;
      }
    }
    // time display id=minutes and id = seconds
    $("#" + key).html(value || 0);
    timerObj[key] = value;
  }

  //immediate invoked function and call the function twice!
  (function detectChanges(key) {
    let input = "#" + key + "-input";

    $(input).change(function () {
      updateValue(key, $(input).val());
    });

    $(input).keyup(function () {
      updateValue(key, $(input).val());
    });

    return arguments.callee;
  })("minutes")("seconds");

  //button functions

  function startTimer() {
    buttonManager(["start", false], ["pause", true], ["stop", true]);
    freezeInputs();

    timerObj.timerId = setInterval(() => {
      timerObj.seconds--;
      // when it's 0:00
      if (timerObj.seconds < 0) {
        if (timerObj.minutes == 0) {
          soundAlarm();
          return stopTimer();
        }
        // minutes is >0
        timerObj.seconds = 59;
        timerObj.minutes--;
      }

      updateValue("minutes", timerObj.minutes);
      updateValue("seconds", timerObj.seconds);
    }, 1000);
  }
  function stopTimer() {
    clearInterval(timerObj.timerId);

    buttonManager(["start", true], ["pause", false], ["stop", false]);
    unfreezeInputs();
    //reset timer
    updateValue("minutes", $("#minutes-input").val());
    updateValue("seconds", $("#seconds-input").val());
  }
  function pauseTimer() {
    buttonManager(["start", true], ["pause", false], ["stop", true]);
    clearInterval(timerObj.timerId);
  }
  //use rest operator here
  // buttonsArray = ['start',true],['stop',false],['pause',true]
  function buttonManager(...buttonsArray) {
    for (let i = 0; i < buttonsArray.length; i++) {
      let button = "#" + buttonsArray[i][0] + "-button";
      if (buttonsArray[i][1]) {
        $(button).removeAttr("disabled");
      } else {
        $(button).attr("disabled", "disabled");
      }
    }
  }
  // using onclick in html is not recommended and it's not working in this case
  // therefore, a better solution is to use jQuery .on
  // or it's  better to use addEventListener
  $("#start-button").on("click", startTimer);
  $("#stop-button").on("click", stopTimer);
  $("#pause-button").on("click", pauseTimer);

  //freezeinputs after user start the timer attr / removeAttr('disabled')
  function freezeInputs() {
    $("#minutes-input").attr("disabled", "disabled");
    $("#seconds-input").attr("disabled", "disabled");
  }

  function unfreezeInputs() {
    $("#minutes-input").removeAttr("disabled", "disabled");
    $("#seconds-input").removeAttr("disabled", "disabled");
  }
});
