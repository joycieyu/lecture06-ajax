'use strict';

//An array of objects representing a couple of music tracks
var songs = [{
    name: "Bohemian Rhapsody - Remastered 2011",
    album_image: "https://i.scdn.co/image/622b72a639157786783cffaccfcea7b306051225",
    preview_url: "https://p.scdn.co/mp3-preview/d5bc71c0bdc98b547a39aeba9538a7c6d33fc342",    
  }, {
    name: "Starman - 2012 Remastered Version",
    album_image: "https://i.scdn.co/image/9598d123dc969fc75835eba82b45b86748e58cbe",
    preview_url: "https://p.scdn.co/mp3-preview/61bef2960dfceea5c37dcb8d4d3e5ef77cb4e533",
  }, {
    name: "Nasty",
    album_image: "https://i.scdn.co/image/821ce8b515a40320fbfccd3c4ab31374327eaaac",
    preview_url: "https://p.scdn.co/mp3-preview/8f1e48f29b418c274ce96fd6ae0f6b5002aefe02",
  }];

var records = document.querySelector('.records');

/**
 * This function takes in an object representing a SINGLE music track
 * and displays it on the page.
 */
function renderTrack(track){

  //select the `.records` section that will contain the records
  //you could also do this before the function declaration


  //create a new `img` element to visually represent the track
  var img = document.createElement('img');

  //set the image's `src` to be the track's `album_image`
    img.setAttribute('src',track.album.images[1].url);
  //img.setAttribute('src', track.album_image);

  //always give images `alt` attributes! The `name` of the track will work fine
  img.setAttribute('alt', track.name);
    img.setAttribute('title', track.name); //for mouse-over descriptions

  //attach the image element to the `.records` section
  records.appendChild(img);

  //add an event listener so that when the track is clicked on,
  //it starts to spin! (add the Font-Awesome utility class `fa-spin`)
  //
  //IMPORTANT: use the callback's `event` parameter and get the `target`
  //to change the element that was clicked on!
  //
  //Bonus: can you make the track stop spinning when clicked again?
  img.addEventListener('click', function(event){
    var target = event.target;
    target.classList.toggle('fa-spin');

    //check the state to decide what to do
    if(previewAudio.src === track.preview_url){ //playing this track
      if(previewAudio.paused){ //check state
        previewAudio.play();
      } else {
        previewAudio.pause();
      }
    }
    else { //different track
      previewAudio.pause(); //pause current
      previewAudio = new Audio(track.preview_url); //create new audio
      previewAudio.play(); //play new
    }
  });
}

//call this function `forEach` element in the `songs` array!
//songs.forEach(renderTrack);

//global variable to track the last preview audio that was played
var previewAudio = new Audio(); //will establish/track the state. Init as "nothing"

var BASE_URI = 'https://api.spotify.com';
var END_POINT = '/v1/search'

var form = document.querySelector('form');
form.addEventListener('submit', function(event) {
  event.preventDefault(); //don't do normal behavior

  var searchTerm = document.querySelector('#searchQuery').value;  

  var queryString = 'type=track&q='+searchTerm;
  var url = BASE_URI + END_POINT + '?'+queryString;

  toggleSpinner();

  fetch(url).then(function(response){
    return response.json();
  })
  .then(renderSearch)
  .catch(renderError)
  .then(toggleSpinner);


  return false; //don't do do normal behavior (for IE)
});

function renderSearch(data) {
    //console.log(data);

    records.innerHTML = ''; //clear out the old records;

    //data.tracks.items.forEach(renderTrack); //basic

    //in case of error or no results (via Dave)
    if (data.error || 0 == data.tracks.items.length) {
        renderError(data.error || new Error("No results found")); //show the error
    } else {
        //render the tracks 
        data.tracks.items.forEach(renderTrack);
    }
}

//from Dave
function renderError(error) {
    console.error(error); //for debugging
    var message = document.createElement('p');
    message.classList.add('alert');
    message.classList.add('alert-danger');
    message.textContent = error.message;
    records.appendChild(message);
}

//from Dave
function toggleSpinner() {
    var spinner = document.querySelector('.fa-spinner');
    spinner.classList.toggle('hidden'); //show/hide the spinner
    var searchButton = document.querySelector('button');
    searchButton.disabled = !searchButton.disabled; //turn on/off the button
}