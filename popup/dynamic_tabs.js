function addElement (noise, noisy, noisyIcon) {
  //Creates all the links under the Playing section
  for (i=0; i < noise.length; i++) {
    var newHyperLink = document.createElement("a");
    var newContent = document.createTextNode(noise[i]);
    var playingDiv = document.getElementById("PlayingTabs");

    //This places the favicon with the tab button
    var iconIMG = document.createElement("img");
    iconIMG.classList.add("resize");
    iconIMG.src = noisyIcon[i];

    //Attaches the class to newHyperLink. Appends the title of the URL that is making sounds and iconIMG
    newHyperLink.classList.add("insertedElemetsLoud");
    newHyperLink.href = "#";
    newHyperLink.appendChild(iconIMG);
    newHyperLink.appendChild(newContent);
   
    //When a user clicks on the button where the title of the URL is, it will direct the user to the tab and make that tab the active window
    newHyperLink.onclick = (function(url,place) {
        return function() {
           onUpdate(url,place);
        };
    })(noise[i], noisy[i]);

    //Creates the Volume icon where a user can press if they would want to mute that URL
    var volumeIcon = document.createElement("button");
    volumeIcon.id = "mutedButton";

    var volumeIconIMG = document.createElement("img");
    volumeIconIMG.src = "volume.jpg";
    volumeIcon.appendChild(volumeIconIMG);

    //When volumeIcon is clicked, it will mute the url and place it into the Muted section
    volumeIcon.onclick = (function(url,place) {
        return function() {
           onMute(url,place);
        };
    })(noise[i], noisy[i]);

    //Inserts into the HTML document and under Playing
    document.body.insertBefore(newHyperLink, playingDiv);
    document.body.insertBefore(volumeIcon, playingDiv);
  }
}

function addMutedElement (quiet, quietId, quietIcon) {
  //Creates all the links under the Muted section
  for (i=0; i < quiet.length; i++) {
    var newHyperLinkMute = document.createElement("a");
    var newContentMute = document.createTextNode(quiet[i]);
    var muteDiv = document.getElementById("MutedTabs");

    //This places the favicon with the tab button
    var iconIMGMute = document.createElement("img");
    iconIMGMute.classList.add("resize");
    iconIMGMute.src = quietIcon[i];

    //Attaches the class to newHyperLinkMute. Appends the title of the URL that is muted and iconIMGMute
    newHyperLinkMute.classList.add("insertedElemetsQuiet"); 
    newHyperLinkMute.href = "#";
    newHyperLinkMute.appendChild(iconIMGMute);
    newHyperLinkMute.appendChild(newContentMute);

    //When a user clicks on the button where the title of the URL is, it will direct the user to the tab and make that tab the active window 
    newHyperLinkMute.onclick = (function(url,place) {
        return function() {
           onUpdate(url,place);
        };
    })(quiet[i], quietId[i]);

    //Creates the Muted icon where a user can press if they would want to unmute that URL
    var mutedIcon = document.createElement("button");
    mutedIcon.id = "mutedButton";
    
    var mutedIconIMG = document.createElement("img");
    mutedIconIMG.src = "mute.png";
    mutedIcon.appendChild(mutedIconIMG);

    //When clicked, it would unmute that url and place it into the Playing section
    mutedIcon.onclick = (function(url,place) {
        return function() {
           onUnMute(url,place);
        };
    })(quiet[i], quietId[i]);

    //Inserts into the HTML document and under Muted
    document.body.insertBefore(newHyperLinkMute, muteDiv);
    document.body.insertBefore(mutedIcon, muteDiv);
  }

}

//When user clicks on the block, they will be sent to that tab using this function. Makes the clicked block the active tab
function onUpdate(url, place) {
  var updateTab = browser.tabs.update(place, {
        active:true,
  });


}

//When user clicks on the mute block, they will mute that tab and cast it into the Muted category.
function onMute(url, place) {
  var muteTab = browser.tabs.update(place, {
        muted: true,
  });
  var soundElement = document.getElementsByClassName("insertedElemetsLoud");
  var soundElementMute = document.getElementById("MutedTabs");

  for (s=0; s < soundElement.length; s++) { 
      if (soundElement[s].innerHTML.includes(url) == true) {
         var soundElementIcon = soundElement[s].nextSibling;
         soundElementIcon.innerHTML = "<img src=\'mute.png\'>";
         document.body.insertBefore(soundElement[s], soundElementMute);
         document.body.insertBefore(soundElementIcon, soundElementMute);
      }     
  } 
}

function onUnMute(url, place) {
  var unMuteTab = browser.tabs.update(place, {
        muted: false,
  });
  var muteElement = document.getElementsByClassName("insertedElemetsQuiet");
  var muteElementSound = document.getElementById("PlayingTabs");

  for (s=0; s < muteElement.length; s++) {
      if (muteElement[s].innerHTML.includes(url) == true) {
         var muteElementIcon = muteElement[s].nextSibling;
         muteElementIcon.innerHTML = "<img src=\'volume.jpg\'>";
         document.body.insertBefore(muteElement[s], muteElementSound);
         document.body.insertBefore(muteElementIcon, muteElementSound);     
      }         
  } 
}


function getListofTabs(tabs) {
  //Arrays hold the title, tab id and favicon of the tab that is playing sounds
  var audibles = [];
  var audiblesId = [];
  var audibleIcon = [];

  //Arrays hold the title, tab id and favicon of the tab that is muted
  var quiet = [];
  var quietId = [];
  var quietIcon = [];
  for (i=0; i < tabs.length; i++){
    if (tabs[i].audible == true) {
       audibles.push(tabs[i].title);
       audiblesId.push(tabs[i].id);
       audibleIcon.push(tabs[i].favIconUrl);
    }
    if (tabs[i].mutedInfo.muted == true) {
       if (tabs[i].title in audibles) {
         console.log("here");
       } else {
         quiet.push(tabs[i].title);
         quietId.push(tabs[i].id);
         quietIcon.push(tabs[i].favIconUrl);
       }
    }
  }

  //When a audible element exists within the quiet array, the audible element will be removed from audibles, audiblesId and audibleIcon. 
  for (p=0; p < quiet.length; p++) {
      if (audibles.includes(quiet[p]) == true) {
        var indexVar = audibles.indexOf(quiet[p]);
        audibles.splice(indexVar, 1);
	audiblesId.splice(indexVar, 1);
	audibleIcon.splice(indexVar, 1);
      }
  }  

  addElement(audibles, audiblesId, audibleIcon);
  addMutedElement(quiet, quietId, quietIcon);
}

function mainThing() {
  //Gets tab information of the current window and passes the information to getListofTabs
  var querying = browser.tabs.query({currentWindow: true});
  querying.then(result => {
    getListofTabs(result);
  });  
}

mainThing();
browser.browserAction.onClicked.addListener(mainThing);
document.body.onload = addElement;

