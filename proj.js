// HTML Elements
const randomizeArrayBtn = document.getElementById("randomize_array_btn");
const sortBtn = document.getElementById("sort_btn");
const barsContainer = document.getElementById("bars_container");
const selectAlgo = document.getElementById("algo");
const speedInput = document.getElementById("speed");
const slider = document.getElementById("slider");

// Constants and Variables
const minRange = 1;
let maxRange = slider.value;
let numOfBars = slider.value;
const heightFactor = 4;
let speedFactor = 100;
let unsortedArray = createRandomArray(numOfBars);

// Event Listeners
slider.addEventListener("input", updateArraySize);
speedInput.addEventListener("change", updateSpeed);
selectAlgo.addEventListener("change", updateAlgorithm);
randomizeArrayBtn.addEventListener("click", randomizeArray);
sortBtn.addEventListener("click", sortArray);
document.addEventListener("DOMContentLoaded", renderBars(unsortedArray));

// Functions
function updateArraySize() {
  numOfBars = slider.value;
  maxRange = slider.value;
  barsContainer.innerHTML = "";
  unsortedArray = createRandomArray(numOfBars);
  renderBars(unsortedArray);
}

function updateSpeed(e) {
  speedFactor = parseInt(e.target.value);
}

function updateAlgorithm() {
  algotouse = selectAlgo.value;
}

function randomizeArray() {
  unsortedArray = createRandomArray(numOfBars);
  barsContainer.innerHTML = "";
  renderBars(unsortedArray);
}

function createRandomArray(size) {
  return Array.from({ length: size }, () => randomNum(minRange, maxRange));
}

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderBars(array) {
  barsContainer.innerHTML = "";
  array.forEach(value => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value * heightFactor}px`;
    barsContainer.appendChild(bar);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Sorting Algorithms
async function bubbleSort(array) {
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        bars[j].style.height = `${array[j] * heightFactor}px`;
        bars[j + 1].style.height = `${array[j + 1] * heightFactor}px`;
        bars[j].style.backgroundColor = "lightgreen";
        bars[j + 1].style.backgroundColor = "lightgreen";
        await sleep(speedFactor);
        bars[j].style.backgroundColor = "aqua";
        bars[j + 1].style.backgroundColor = "aqua";
      }
    }
    bars[array.length - i - 1].style.backgroundColor = "lightgreen";
  }
}

async function quickSort(array, left, right) {
  if (left < right) {
    const partitionIndex = await partition(array, left, right);
    await quickSort(array, left, partitionIndex - 1);
    await quickSort(array, partitionIndex, right);
  }
  resetBarColors();
}

async function partition(array, left, right) {
  const pivotIndex = Math.floor((left + right) / 2);
  const pivot = array[pivotIndex];
  let i = left;
  let j = right;
  const bars = document.getElementsByClassName("bar");

  bars[pivotIndex].style.backgroundColor = "red";

  while (i <= j) {
    while (array[i] < pivot) i++;
    while (array[j] > pivot) j--;
    if (i <= j) {
      [array[i], array[j]] = [array[j], array[i]];
      bars[i].style.height = `${array[i] * heightFactor}px`;
      bars[j].style.height = `${array[j] * heightFactor}px`;
      bars[i].style.backgroundColor = "lightgreen";
      bars[j].style.backgroundColor = "lightgreen";
      await sleep(speedFactor);
      bars[i].style.backgroundColor = "aqua";
      bars[j].style.backgroundColor = "aqua";
      i++;
      j--;
    }
  }
  return i;
}

async function insertionSort(array) {
  const bars = document.getElementsByClassName("bar");
  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      bars[j + 1].style.height = `${array[j + 1] * heightFactor}px`;
      bars[j + 1].style.backgroundColor = "red";
      await sleep(speedFactor);
      bars[j + 1].style.backgroundColor = "aqua";
      j--;
    }
    array[j + 1] = key;
    bars[j + 1].style.height = `${array[j + 1] * heightFactor}px`;
    bars[j + 1].style.backgroundColor = "lightgreen";
  }
  resetBarColors();
}

async function heapSort(array) {
  const bars = document.getElementsByClassName("bar");
  for (let i = Math.floor(array.length / 2); i >= 0; i--) {
    await heapify(array, array.length, i);
  }
  for (let i = array.length - 1; i >= 0; i--) {
    await swap(array, 0, i, bars);
    await heapify(array, i, 0);
  }
  resetBarColors();
}

async function heapify(array, n, i) {
  const bars = document.getElementsByClassName("bar");
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  if (left < n && array[left] > array[largest]) largest = left;
  if (right < n && array[right] > array[largest]) largest = right;
  if (largest != i) {
    await swap(array, i, largest, bars);
    await heapify(array, n, largest);
  }
}

async function swap(array, i, j, bars) {
  [array[i], array[j]] = [array[j], array[i]];
  bars[i].style.height = `${array[i] * heightFactor}px`;
  bars[j].style.height = `${array[j] * heightFactor}px`;
  bars[i].style.backgroundColor = "red";
  bars[j].style.backgroundColor = "red";
  await sleep(speedFactor);
  bars[i].style.backgroundColor = "aqua";
  bars[j].style.backgroundColor = "aqua";
}

async function mergeSort(array) {
  if (array.length < 2) return array;
  const middle = Math.floor(array.length / 2);
  const left = await mergeSort(array.slice(0, middle));
  const right = await mergeSort(array.slice(middle));
  return await merge(array, left, right);
}

async function merge(array, left, right) {
  const bars = document.getElementsByClassName("bar");
  let i = 0, j = 0, k = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      array[k] = left[i];
      i++;
    } else {
      array[k] = right[j];
      j++;
    }
    bars[k].style.height = `${array[k] * heightFactor}px`;
    bars[k].style.backgroundColor = "lightgreen";
    await sleep(speedFactor);
    bars[k].style.backgroundColor = "aqua";
    k++;
  }
  while (i < left.length) {
    array[k] = left[i];
    bars[k].style.height = `${array[k] * heightFactor}px`;
    bars[k].style.backgroundColor = "lightgreen";
    await sleep(speedFactor);
    bars[k].style.backgroundColor = "aqua";
    i++;
    k++;
  }
  while (j < right.length) {
    array[k] = right[j];
    bars[k].style.height = `${array[k] * heightFactor}px`;
    bars[k].style.backgroundColor = "lightgreen";
    await sleep(speedFactor);
    bars[k].style.backgroundColor = "aqua";
    j++;
    k++;
  }
  return array;
}

function resetBarColors() {
  const bars = document.getElementsByClassName("bar");
  for (let bar of bars) {
    bar.style.backgroundColor = "aqua";
  }
}

function sortArray() {
  switch (algotouse) {
    case "bubble":
      bubbleSort(unsortedArray);
      break;
    case "merge":
      mergeSort(unsortedArray);
      break;
    case "heap":
      heapSort(unsortedArray);
      break;
    case "insertion":
      insertionSort(unsortedArray);
      break;
    case "quick":
      quickSort(unsortedArray, 0, unsortedArray.length - 1);
      break;
    default:
      bubbleSort(unsortedArray);
      break;
  }
}
