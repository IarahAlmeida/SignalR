"use strict";

// create connection
var connection = new signalR.HubConnectionBuilder().withUrl("/heartBeatMonitorHub").build();

/// CHART
const maxElements = 30;

const firstCTX = document.getElementById('firstHeartBeatChart');
const secondCTX = document.getElementById('secondHeartBeatChart');

let firstUpdateCount = 0;
let secondUpdateCount = 0;

const firstData = {
    datasets: [
        {
            label: "Iarah",
            fill: false,
            borderColor: 'rgb(255, 159, 64)',
            tension: 0.1,
            data: []
        }
    ]
};
const secondData = {
    datasets: [
        {
            label: "Rafael",
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            data: []
        }
    ]
};

const firstConfig = {
    type: 'line',
    data: firstData,
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Iarah - Heart Beat Line Chart'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
};
const secondConfig = {
    type: 'line',
    data: secondData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Rafael - Heart Beat Line Chart'
            }
        }
    },
};

var firstHeartBeatLineChart = new Chart(firstCTX, firstConfig);
var secondHeartBeatLineChart = new Chart(secondCTX, secondConfig);

const getElapsedTimeString = (timeDiff) => {
    let milliseconds = Math.floor(timeDiff % 1000);
    let millisecondsAsString = milliseconds < 100 ? '00' + milliseconds : milliseconds < 10 ? '0' + milliseconds : milliseconds + '';

    timeDiff = timeDiff / 1000;
    let seconds = Math.floor(timeDiff % 60);
    let secondsAsString = seconds < 10 ? '0' + seconds : seconds + '';

    timeDiff = Math.floor(timeDiff / 60);
    let minutes = timeDiff % 60;
    let minutesAsString = minutes < 10 ? '0' + minutes : minutes + '';

    timeDiff = Math.floor(timeDiff / 60);
    let hours = timeDiff % 24;

    timeDiff = Math.floor(timeDiff / 24);
    let days = timeDiff;

    let totalHours = hours + (days * 24);
    let totalHoursAsString = totalHours < 10 ? '0' + totalHours : totalHours + '';

    if (totalHoursAsString === "00") {
        return minutesAsString + ':' + secondsAsString + '.' + millisecondsAsString;
    } else {
        return totalHoursAsString + ':' + minutesAsString + ':' + secondsAsString + '.' + millisecondsAsString;
    }
}

// start connection, start receiving data and updating charts
connection.start().then(() => {
    connection.stream("GetHeartBeatWithChannelReader")
        .subscribe({
            next: (item) => {
                if (item.name == 'Iarah') {
                    firstHeartBeatLineChart.data.labels.push(getElapsedTimeString(item.x));
                    firstHeartBeatLineChart.data.datasets[0].data.push(item.y);

                    firstHeartBeatLineChart.update();

                    if (firstUpdateCount > maxElements) {
                        firstHeartBeatLineChart.data.labels.shift();
                        firstHeartBeatLineChart.data.datasets[0].data.shift();
                    } else {
                        firstUpdateCount++;
                    }
                } else if (item.name == 'Rafael') {
                    secondHeartBeatLineChart.data.labels.push(getElapsedTimeString(item.x));
                    secondHeartBeatLineChart.data.datasets[0].data.push(item.y);

                    secondHeartBeatLineChart.update();

                    if (secondUpdateCount > maxElements) {
                        secondHeartBeatLineChart.data.labels.shift();
                        secondHeartBeatLineChart.data.datasets[0].data.shift();
                    } else {
                        secondUpdateCount++;
                    }
                }
            },
            complete: () => {
                console.log('Stream completed');
            },
            error: (err) => {
                var li = document.createElement("li");
                li.textContent = err;
                document.getElementById("messagesList").appendChild(li);
            },
        });
});