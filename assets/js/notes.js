// date right now, in format 'Monday June 06, 2022' - display at end of header
var timeNow = moment().format("dddd MMMM DD, YYYY");
var displayDate = document.getElementById("currentDay");
displayDate.innerText = timeNow;

// select the container to fill with hour/task slots
var timeContainerEl = document.querySelector(".container");
// empty array for storage later; I initialize it to SOMETHING || [] but seems best to cover all bases.
var taskStorage = [];

// allows user to select which time to start and end day at--I think 5am to 11pm is good. Can easily add functionality later to allow user input and update dynamically
var firstHour = 5;
var lastHour = 23;

// if local storage does not yet have a current day (i.e. it is NULL), then add currentDay value of NOW and create initial storage array
if (!localStorage.getItem("currentDay")) {
    localStorage.setItem("currentDay", moment());
    // initialize localStorage, creating an array of objects, one for every hour between firstHour and lastHour
    for (var i = firstHour; i <= lastHour; i++) {
        var taskHourDataObj = {
            hour: i,
            task: "" //no task yet entered
        };
        // fills taskStorage array with what is already in localStorage, or if there's nothing, initializes with an empty array.
        taskStorage = JSON.parse(localStorage.getItem("tasks")) || [];
        // adds a new object to the array
        taskStorage.push(taskHourDataObj);
        // using taskStorage, which now has 1 more object than localStorage, we set an item "tasks" in localStorage
        localStorage.setItem("tasks", JSON.stringify(taskStorage));
    }
    // if currentDay in localStorage is NOT EQUAL to today, then call function newDay (which clears local storage, then updates localStorage currentDay) 
} else if (moment(localStorage.getItem("currentDay")).format("MM DD, YYYY") != moment().format("MM DD, YYYY")) {
    newDay();
}

// create divs, from firstHour to lastHour. 
for (var i = firstHour; i <= lastHour; i++) {
    // create and add class/id for a DIV to hold THE TIME
    var newTimeEl = document.createElement("div");
    newTimeEl.className = "time-hourly";
    newTimeEl.setAttribute("id", "hourly-" + i);

    // Creates a time at the hour of i, so from firstHour to lastHour
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
}

// functionality for background color of an hourBlock element to change, based on CURRENT HOUR (past, present, future)
function checkTime() {
    // cycles through every hour, from firstHour to lastHour
    for (var i = firstHour; i <= lastHour; i++) {
        // using i index to select IDs of relevant elements below
        var hourBlockId = "hour-block-" + i;
        var hourId = "hour-" + i;

        // select elements--hour for the currentHour, and hourBlock for changing the background color
        var hourBlockEl = document.getElementById(hourBlockId);
        var hourEl = document.getElementById(hourId);

        // saves the current hour as a moment variable, by extracting the hour from the ID
        var currentHour = moment({ h: hourEl.textContent })

        // if it's true that the currentHour is in the PAST/PRESENT/FUTURE, change background color
        if (currentHour.hour() === moment().hour()) { //present
            hourBlockEl.style.backgroundColor = "#eb8dd6e4";
        } else if (currentHour.isBefore(moment())) { //past
            hourBlockEl.style.backgroundColor = "#d3d3d3";
            hourBlockEl.style.color = "white";
        } else if (currentHour.isAfter(moment())) { //future
            hourBlockEl.style.backgroundColor = "#87f287c4";
        }
    }
};

// checks time every minute, to update background color or not
setInterval(function () {
    console.log("time check");
    checkTime();
}, (1000 * 60))

// when a new day arrives, "if/else if" at top of code calls this function to modify localStorage
function newDay() {
    // new day, new storage - clear out yesterday's saved tasks
    localStorage.clear();
    // change the date at the top of the page - this is called at the top of the code, but seems like a logical step to include here as well.
    displayDate.innerText = moment().format("dddd MMMM DD, YYYY");
    // update new currentDay item 
    localStorage.setItem("currentDay", moment());
}

// takes user's new input for a task, and the index (hour for which they added task), to save in localStorage for persistence
function saveTasks(index, taskValue) {
    // save array of objects in variable array for manipulation, JSON so it's not a string
    var array = localStorage.getItem("tasks");
    array = JSON.parse(array);
    // assign new value for task, according to user input
    array[index - firstHour].task = taskValue;
    // send new array back to localStorage, JSON string format
    localStorage.setItem("tasks", JSON.stringify(array));
};

// takes localStorage item "tasks" and loops through it to fill schedule by the hour with tasks
function loadTasks() {
    // if localStorage "tasks" doesn't exist, returns null. You can't fill with tasks if they don't exist, so you exit the function to avoid an error.
    if (localStorage.getItem("tasks") === null) {
        return;
    }
    // save array of objects in variable array for manipulation, JSON so it's not a string
    var savedTasks = localStorage.getItem("tasks");
    savedTasks = JSON.parse(savedTasks);
    // loop through entire array, sending each object (representing the hour, and the associated task) to createTaskEl function which adds tasks to the HTML
    for (let i = 0; i < savedTasks.length; i++) {
        createTaskEl(savedTasks[i]);
    }
};

function createTaskEl(taskDataObj) {
    // targets the <p> element using the ID, "p-hour-task-" followed by the hour key value.
    var taskId = "p-hour-task-" + taskDataObj.hour;
    var taskDisplayed = document.getElementById(taskId);
    // add the innerText that displays on the page, according to the saved task value
    taskDisplayed.innerText = taskDataObj.task;
}

// when you click anywhere on the "hour-task" class element, then the following function occurs
$(".hour-task").on("click", function () {
    var paragraphEl = $(this).find('.p-hour-task')
    // takes the current task, so when the textarea is created, it's filled with the prior task and is not empty
    var text = $(this)
        .text()
        .trim();
    // creates an editable textarea, and has the value inside initialized to the previous task text
    var textInput = $("<textarea>")
        .addClass("form-control")
        .val(text);
    // replaces the paragraph element with a textarea
    $(paragraphEl).replaceWith(textInput);
    textInput.trigger("focus");
})

// when you click anywhere outside of the textarea created above, then the following function occurs
$(".hour-task").on("blur", "textarea", function () {
    // get textarea's current value/text - i.e., the new, edited task entered by user
    var text = $(this)
        .val()
        .trim();

    // get the id attribute of the nearest timeBlock, which helps us know which hour X was selected
    var status = $(this)
        .closest(".time-block")
        .attr("id")
        .replace("hour-block-", "");

    // status is the hour block that we have edited, text is the user input from the textarea. Saves the task in local storage.
    saveTasks(status, text);

    // recreate p element
    var taskP = $("<p>")
        .addClass('p-hour-task')
        .text(text);

    // replace textarea with p element. This "blur" function replaces the "save" button. 
    // In my mind, functionally clicking out of an object to save it makes more sense. 
    $(this).replaceWith(taskP);
})

loadTasks();
checkTime();


 // hourBlock.classList.add("future");
// hourBlock.classList.add("present");
 // hourBlock.classList.add("past");

// // create local storage
    // // takes index, which is the hour user edited, and taskValue, which is the value of the task used entered
    // var taskHourDataObj = {
    //     hour: index,
    //     task:taskValue
    // }
    // // fills taskStorage array with what is already in localStorage, or if there's nothing, initializes with an empty array.
    // taskStorage = JSON.parse(localStorage.getItem("tasks")) || [];
    // console.log(taskStorage);
    // // adds a new object to the array, which catalogues what the user entered as a task and for which hour.
    // taskStorage.push(taskHourDataObj);
    // // using taskStorage, which now has 1 more object than localStorage, we set an item "tasks" in localStorage
    // localStorage.setItem("tasks", JSON.stringify(taskStorage));

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
// function saveTasks() {
//     // create an array, whereby 2 things are matched--the hour, and the text of the task.

//     // index 0 - hour 5
//     // index 1 - hour 6
//     // ...
//     // index 18 - hour 23

//     // when you edit a task, you take the hour it's happening, you index at that hour--so [HOUR-5] index--
//     // then insert the newly edited task as the value of the task key
//     [
//         {
//             hour: "5",
//             task: "some task blah"
//         },
//         {
//             hour: "6",
//             task: "some task"
//         }
//     ]
// }