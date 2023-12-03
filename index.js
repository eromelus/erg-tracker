import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const ergWorkoutsArray = [
    {
      "workoutDate": "Nov 16 2023",
      "totalTime": "1:27:40.6",
      "totalDistanceMeters": 36000,
      "averagePace": "2:02.3",
      "averageSpm": "20",
      "workoutType": "3x6000m/1:30r"
    },
    {
      "workoutDate": "Nov 21 2023",
      "totalTime": "39:34.2",
      "totalDistanceMeters": 8000,
      "averagePace": "1:58.4",
      "averageSpm": "25.4",
      "workoutType": "8x1000m/1:00r"
    },
    {
      "workoutDate": "Nov 22 2023",
      "totalTime": "10:00.0",
      "totalDistanceMeters": 2256,
      "averagePace": "2:13.2",
      "averageSpm": "19.4",
      "workoutType": "10:00"
    },
    {
      "workoutDate": "Nov 22 2023",
      "totalTime": "10:00.0",
      "totalDistanceMeters": 2220,
      "averagePace": "2:15.3",
      "averageSpm": "19.6",
      "workoutType": "10:00"
    },
    {
      "workoutDate": "Aug 06 2023",
      "totalTime": "2:00:00.0",
      "totalDistanceMeters": 27749,
      "averagePace": "2:09.7",
      "averageSpm": "20",
      "workoutType": "2:00:00"
    }
]

const firebaseConfig = {
    databaseURL: "https://erg-tracker-155b3-default-rtdb.firebaseio.com/",
}
const app = initializeApp(firebaseConfig)
const database = getDatabase(app);
const ergWorkoutListInDB = ref(database, "ergWorkoutList")

const allTimeStatsEl = document.getElementById("all-time-stats")

// ergWorkoutsArray.forEach(ergWorkout => {
//     push(ergWorkoutListInDB, ergWorkout)
// })


onValue(ergWorkoutListInDB, function(snapshot) {
    if (snapshot.exists()) {
        const workouts = Object.entries(snapshot.val()).map(workout => workout[1])
        const stats = calculateAllTimeStats(workouts)
        
        Object.entries(stats).forEach(stat => {
            appendItemToAllTimeListEl(stat)
        })
    }
})


function appendItemToAllTimeListEl(item) {
  const itemName = item[0]
  const itemValue = item[1]
  
  const newEl = document.createElement("li")
  newEl.innerHTML = `${camelCaseToCapitalized(itemName)}<span>${itemValue}</span>`
  allTimeStatsEl.append(newEl)
}


function calculateAllTimeStats(workouts) {
  let totalMeters = 0;
  let totalSpm = 0;
  let workoutCount = workouts.length;

  workouts.forEach(workout => {
      // Accumulate total meters
      totalMeters += workout.totalDistanceMeters;

      // Accumulate SPM and parse it as a float
      totalSpm += parseFloat(workout.averageSpm);
  });

  // Calculate metrics
  const metersPerErg = totalMeters / workoutCount;
  const avgSpm = parseFloat((totalSpm / workoutCount).toFixed(1)); // Round to 1 decimal place

  return {
    totalMeters,
    metersPerErg,
    avgSpm,
    totalWorkoutCount: workoutCount
  };
}

function camelCaseToCapitalized(text) {
  // Insert space before each uppercase letter and split into words
  const words = text.replace(/([A-Z])/g, ' $1').trim().split(' ');

  // Capitalize each word and replace 'per' with '\'
  return words.map(word => {
      if (word.toLowerCase() === 'per') {
          return '\/';
      } else {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
  }).join(' ');
}
