// date right now, in format 'Monday June 06, 2022'
var timeNow = moment().format("dddd MMMM DD, YYYY");
var displayDate = document.getElementById("currentDay")
displayDate.innerText = timeNow;
var timeContainerEl = document.querySelector(".container");

// var startTime = moment().set("hour",5).set("minute",0).format("HH:mm");
// console.log(startTime);

var taskStorage = [];
// want to create divs, from 5am, to 11pm. this will need to reset every day, when the next day begins.
for (var i = 5; i <= 23; i++) {
    // create and add class/id for a DIV to hold THE TIME
    var newTimeEl = document.createElement("div");
    newTimeEl.className = "time-hourly";
    newTimeEl.setAttribute("id", "hourly-" + i);

    // Creates a time at the hour of i, so from 5am to 11pm, or 5 to 23 in military time
    var startTime = moment({
        h: i
    });

    // create and add class/id/innerText for a P to hold THE TIME
    var startTimeEl = document.createElement("p");
    startTimeEl.className = "time-by-hour col-2";
    startTimeEl.setAttribute("id", "hour-" + i);
    startTimeEl.innerText = startTime.format("HH:mm");

    // append the P element with TIME to DIV element for TIME
    newTimeEl.appendChild(startTimeEl); //<div> <p></p> </div

    // create and add class/id for a DIV to hold THE TASK
    var hourTaskEl = document.createElement("div");
    hourTaskEl.className = "hour-task col-10";
    hourTaskEl.setAttribute("id", "hour-task-" + i);

    // create and add class/id for a P to hold THE TASK
    var newHourTaskEl = document.createElement("p");
    newHourTaskEl.className = "p-hour-task";
    newHourTaskEl.setAttribute("id", "p-hour-task-" + i);

    // append the P element with TASK to DIV element for TASK
    hourTaskEl.appendChild(newHourTaskEl);

    // create and add class/id for a DIV to hold THE TIME BLOCK
    var newTimeBlockEl = document.createElement("div");
    newTimeBlockEl.className = "time-block row";
    newTimeBlockEl.setAttribute("id", "hour-block-" + i);

    // appends DIV elements with TIME and TASK, respectively, to DIV element for TIME BLOCK 
    newTimeBlockEl.appendChild(newTimeEl);
    newTimeBlockEl.appendChild(hourTaskEl);

    // append DIV element with TIME div and TASK div to DIV CONTAINER
    timeContainerEl.appendChild(newTimeBlockEl);

    console.log(startTime.isBefore(moment()));
}

// functionality for background color to change for each hour-XX <p> element as the hour changes
function checkTime() {
    // if startTimeEl has an hour less than Moment(), turn it GREY, add class past - can remove specific with "classList.remove("class name")"
    // if startTimeEl has an hour that matches Moment(), turn it PINK, add class present
    // if startTimeEl has an hour greater than Moment(), turn it BLUE, add class future
    for(var i=5; i<=23; i++){
        var hourBlockId = "hour-block-"+i;
        var hourId = "hour-"+i;
        var hourBlock = document.getElementById(hourBlockId);
        var hour = document.getElementById(hourId);

        var currentHour = moment({h:hour.textContent})

        // if it's true that the currentHour is in the PAST, add appropriate class
        if(currentHour.hour()===moment().hour()){
            hourBlock.classList.add("present");
        }else if(currentHour.isBefore(moment())){
            hourBlock.classList.add("past");
        } else if(currentHour.isAfter(moment())){
            hourBlock.classList.add("future");
        }

    }
    
    // if it's a new day, then run newDay()
}

// checks time every 30 minutes
setInterval(function () {
    console.log("time check");
    checkTime();
}, (1000 * 60))

// might not need this
// function editHour(event){
//     var targetEl = event.target;
//     console.log(targetEl);
//     console.log(targetEl.getAttribute('id'));
// }
// timeContainerEl.addEventListener("click",editHour);


// need divs in class container to have 2 elements - a div that contains the hour on the left <p>, and a div that contains an editable area on the right + save button
// ^can get that functionality from original kanban, since it involves elements that don't already exist. 

// function to save tasks and hours into local storage
function saveTasks() {
    // create an array, whereby 2 things are matched--the hour, and the text of the task.

    // index 0 - hour 5
    // index 1 - hour 6
    // ...
    // index 18 - hour 23

    // when you edit a task, you take the hour it's happening, you index at that hour--so [HOUR-5] index--
    // then insert the newly edited task as the value of the task key
    [
        {
            hour: "5",
            task: "some task blah"
        },
        {
            hour: "6",
            task: "some task"
        }
    ]
}

// when a new day arrives, need to clear out localStorage
function newDay() {
    // new day, new storage - clear out yesterday's saved tasks
    localStorage.clear();
    
    // change the date at the top of the page
    displayDate.innerText = moment().format("dddd MMMM DD, YYYY");
}

// takes user's new input for a task, and the index (hour for which they added task), to save in localStorage for persistence
function saveTasks(index, taskValue) {
    // create local storage 
    // takes index, which is the hour user edited, and taskValue, which is the value of the task used entered
    var taskHourDataObj = {
        hour: index,
        task:taskValue
    }
    // fills taskStorage array with what is already in localStorage, or if there's nothing, initializes with an empty array.
    taskStorage = JSON.parse(localStorage.getItem("tasks")) || [];
    // adds a new object to the array, which catalogues what the user entered as a task and for which hour.
    taskStorage.push(taskHourDataObj);
    // using taskStorage, which now has 1 more object than localStorage, we set an item "tasks" in localStorage
    localStorage.setItem("tasks", JSON.stringify(taskStorage));
}

// takes localStorage item "tasks" and loops through it to fill schedule by the hour with tasks
function loadTasks(){
    var savedTasks = localStorage.getItem("tasks");
    // had this in my previous code, not sure why I need it
    if(taskStorage===null){
        return false;
    }
    savedTasks=JSON.parse(savedTasks);
    // console.log(savedTasks);
    // console.log(savedTasks[1].name);
    // console.log(savedTasks[1]);
    for(let i=0;i<savedTasks.length;i++){
        createTaskEl(savedTasks[i]);
    }
};

function createTaskEl(taskDataObj){
    var taskId = "p-hour-task-" + taskDataObj.hour;
    var taskDisplayed = document.getElementById(taskId);
    taskDisplayed.innerText=taskDataObj.task;
}

// when you click anywhere in the div element, then you can edit that particular area
// when you click out of it, or blur it, then it automatically saves that task to local Storage, so if you refresh the page, the task persists

// .hour-block on 79 and 90 allow you, .hour-task
// attempt to get editable area in each Time Block
$(".hour-task").on("click", function () {
    var paragraphEl = $(this).find('.p-hour-task')
    var text = $(this)
        .text()
        .trim();
    var textInput = $("<textarea>")
        .addClass("form-control")
        .val(text);
    $(paragraphEl).replaceWith(textInput);
    textInput.trigger("focus");
})

$(".hour-task").on("blur", "textarea", function () {
    // get textarea's current value/text
    var text = $(this)
        .val()
        .trim();

    // get parent ul's id attribute
    var status = $(this)
        .closest(".time-block")
        .attr("id")
        .replace("hour-block-", "");

    // get the task's position in the list of other li elements
    // status is the hour block that we have edited
    saveTasks(status, text);

    // recreate p element
    var taskP = $("<p>")
        .addClass('p-hour-task')
        .text(text);
    //.addClass("m-1")

    // replace textarea with p element
    $(this).replaceWith(taskP);
})



loadTasks();
checkTime();
// newDay()




