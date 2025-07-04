
let alarmTimeout = null;
const alarmSound = new Audio("Sound The Alarm - TrackTribe.mp3");
alarmSound.loop = true;

function unlockSound() {
    alarmSound.play().then(() => {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        console.log("Alarm sound unlocked.");
    }).catch(err => {
        console.warn("Sound unlock failed:", err);
    });
    document.removeEventListener("click", unlockSound);
}
document.addEventListener("click", unlockSound);

function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById("current-time").innerText = timeString;
}
updateCurrentTime();
setInterval(updateCurrentTime, 1000);

function setAlarm() {
    const input = document.getElementById("AlarmClock");
    const status = document.getElementById("status");

    if (!input.value) {
        status.innerText = "Please set a valid time.";
        return;
    }

    const now = new Date();
    const alarm = new Date();

    const [hours, minutes] = input.value.split(":");
    alarm.setHours(+hours);
    alarm.setMinutes(+minutes);
    alarm.setSeconds(0);

    if (alarm < now) {
        alarm.setDate(alarm.getDate() + 1);
    }

    const timeToAlarm = alarm.getTime() - now.getTime();

    if (alarmTimeout) {
        clearTimeout(alarmTimeout);
    } 

    alarmTimeout = setTimeout(() => {
        status.innerText = "⏰ Alarm ringing!";
        
        alarmSound.play().catch(err => {
            console.error("Playback failed:", err);
        });

        alert("⏰ Alarm ringing!");

        alarmSound.pause();
        alarmSound.currentTime = 0;
    }, timeToAlarm);

    status.innerText = `Alarm set for ${input.value}`;
    
    fetch("http://127.0.0.1:5001/api/alarms", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ time: input.value })
    }).then(res => res.json())
      .then(data => {
        console.log("Saved:", data);
        loadAlarmHistory();
    }) .catch(err => {
        console.error("Save failed, storing locally:", err);
        addToLocalStorage(input.value);
        loadAlarmHistory();
    });
}

function loadAlarmHistory() {
    fetch("http://127.0.0.1:5001/api/alarms")
        .then(res => res.json())
        .then(alarms => {
            const list = document.getElementById("alarm-history");
            list.innerHTML = "";
            alarms.forEach(a => {
                const li = document.createElement("li");
                li.textContent = a.time;
                li.onclick = () => {
                    document.getElementById("AlarmClock").value = a.time;
                };
                list.appendChild(li);
            });
        })
        .catch(err => {
            console.warn("Backend unavailable. Using localStorage.", err);
            const alarms = getFromLocalStorage();
            renderAlarmList(alarms);
        });
} 

function renderAlarmList(alarms) {
    const list = document.getElementById("alarm-history");
    list.innerHTML = "";
    alarms.forEach(a => {
        const li = document.createElement("li");
        li.textContent = a.time;
        li.onclick = () => {
            document.getElementById("AlarmClock").value = a.time;
        };
        list.appendChild(li);
    });
}

function saveToLocalStorage(alarms) {
    localStorage.setItem("alarms", JSON.stringify(alarms));
}

function getFromLocalStorage() {
    const alarms = localStorage.getItem("alarms");
    return alarms ? JSON.parse(alarms) : [];
}

function addToLocalStorage(time) {
    const alarms = getFromLocalStorage();
    alarms.unshift({ time });
    if (alarms.length > 10) alarms.pop();
    saveToLocalStorage(alarms);
}

loadAlarmHistory();
