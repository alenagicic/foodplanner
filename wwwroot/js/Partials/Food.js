import './popup.js';
import { createPopup, populateFoodGenerator, populateImageUpload, removePopup } from './popup.js';

document.addEventListener('DOMContentLoaded', () => {
    const selectList = document.querySelector(".food-filter-select");

    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get('value');

    if (param !== null) {
        selectList.value = param;
    }
});


// If press on fa-pen-to-square take me to that recipe!

const penToSquare = document.querySelectorAll(".fa-pen-to-square")

document.getElementById('generate-btn').addEventListener("mousedown", (e) => {
    createPopup()
    populateFoodGenerator()
})
