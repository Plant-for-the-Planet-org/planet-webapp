let tasks = 4;

let arr = [
  [1, 2],
  [2, 4],
  [3, 5],
  [5, 6],
];

function breakTime(arr, tasks) {
  var values1 = arr.map(function (el) {
    return el[0];
  });
  var values2 = arr.map(function (el) {
    return el[1];
  });

  let allValues = values1.concat(values2);
  var max = Math.max.apply(null, allValues);
  var min = Math.min.apply(null, allValues);

  let totalTime = max - min;

  let taskTime = 0;
  arr.map((el) => {
    taskTime += el[1] - el[0];
  });

  return totalTime - taskTime;
}

console.log(breakTime(arr, tasks));
