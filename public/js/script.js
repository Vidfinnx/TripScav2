//Auto Scroll to Displayed Cards
var display = document.getElementById("app");

function scrolled() {
  display.scrollIntoView(true);
}





//Construct Card Data Arrays
function makeButtons() {
  const buttons = document.querySelectorAll(".savebutton")
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].setAttribute("id", i)
    buttons[i].addEventListener('click', save)
  }
  // console.log(buttons);

  var sitesarray = [];
  var sites = document.querySelectorAll("#site");
  for (var i = 0; i < sites.length; i++)
    sitesarray.push(sites[i].innerText);
  //  console.log(sitesarray);

  var citiesarray = [];
  var cities = document.querySelectorAll("#city");
  for (var i = 0; i < cities.length; i++)
    citiesarray.push(cities[i].innerText);
  //  console.log(citiesarray);

  var ratingsarray = [];
  var ratings = document.querySelectorAll("#rating");
  for (var i = 0; i < ratings.length; i++)
    ratingsarray.push(ratings[i].innerText);
  //  console.log(ratingsarray);

  var picturesarray = [];
  var pictures = document.querySelectorAll("#picture");
  for (var i = 0; i < pictures.length; i++)
    picturesarray.push(pictures[i].childNodes[0].attributes.src.nodeValue);
  //  console.log(picturesarray);

  var descriptionarray = [];
  var description = document.querySelectorAll("#description");
  for (var i = 0; i < description.length; i++)
    descriptionarray.push(description[i].innerText);
  //  console.log(descriptionarray);


  //Save Vacation Site
  async function save(event) {
    x = event.target.parentElement.id
    // console.log(event.target.parentElement);

    const site = sitesarray[x];
    const city = citiesarray[x];
    const rating = ratingsarray[x];
    const picture = picturesarray[x];
    const description = descriptionarray[x];


    if (site) {
      const response = await fetch('/api/post/save', {
        method: 'POST',
        body: JSON.stringify({
          site,
          city,
          rating,
          picture,
          description
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        event.target.parentElement.setAttribute("id", "disabled")
        event.target.setAttribute("src", "public/img/c3psaved.png")
        console.log('success');
      } else {
        alert(response.statusText);
      }
    }
  }
}








//function timer to reduce api call spam Inserts Delay with Spam
let timerId;

function doActionNoSpam() {
  //Reset Timeout if function is called before it ends
  if (!(timerId == null)) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(function () {
    // saveUrl()
    search()
    //Place code that you don't want to get spammed here
  }, 100); //100ms Timeout
  //Place code that can be spammed here (UI updates, etc)
};

//Remove and Render Cards With New Search Results to prevent endless cards
function removeCards() {
  const cards = document.getElementById("app")
  if (cards) {
    cards.innerHTML = ""
  } else {
    return;
  }
}

// SAVE SEARCHED COUNTRY TO DATABASE UNDER LOGGED IN USER
// async function saveUrl() {

//   const site = document.getElementById("search-bar").value;

//   if (site) {
//     const response = await fetch('/api/post/search', {
//       method: 'POST',
//       body: JSON.stringify({
//         site,
//       }),
//       headers: { 'Content-Type': 'application/json' }
//     });
//     if (response.ok) {
//       console.log('success');

//     } else {
//       alert(response.statusText);
//     }
//   }
// }


let countryCode;

function search() {
  let searchText = document.getElementById("search-bar").value;

  var config = {
    method: "get",
    url: `https://restcountries.eu/rest/v2/name/${searchText}`,
    headers: {},
  };

  axios(config)
    .then(function (response) {
      console.log(response.data[0].alpha2Code.toLowerCase());
      countryCode = response.data[0].alpha2Code.toLowerCase();
      // countryCodeLower = countryCode.toLowerCase();
      input();
      // return countryCodeLower;
    })
    .catch(function (error) {
      console.log(error);
    });
}




function input() {
  let code = countryCode;

  var config = {
    method: "get",
    url: `https://www.triposo.com/api/20210615/poi.json?countrycode=${code}&order_by=-score&count=20&fields=images,attribution,location_id,name,score,location_ids,snippet,intro`,
    headers: {
      "X-Triposo-Account": "YU3ML92G",
      "X-Triposo-Token": "6ny9va4c72n2xj5b9sw7wpjlubr7uitv",
    },
  };

  axios(config)
    .then(function (response) {
      // console.log(response.data);
      const html = response.data.results
        .map((event) => {
          // console.log(event);
          // rounds down the rating
          let score = event.score;
          let roundedScore = score.toFixed(2);
          // uses regex to remove uncessary text from city names
          let city = event.location_id;
          if (city) {
            city = city.replace("2C_", " ");
            city = city.replace(/_/g, " ");
            city = city.replace(/-/g, " ");
            city = city.replace(/[0-9]/g, " ");
            city = city.replace("wv", " ");
          }
          //           let imageHTML;
          // if (event.images.length > 0) {
          //   imageHTML = event.images[0].sizes.medium.url;
          // }else {
          //   imageHTML = event.name;}         
          return `
   <div class="column is-full-mobile is-half-tablet is-half-desktop  is-one-fifth-fullhd" >
    <div class="user">
      <div id="site"><span class="font">Site:</span> ${event.name}</div>
      <div id="city"><span class="font">City:</span> ${city}</div>
      <div id="rating"><span class="font">Rating:</span> ${roundedScore}/10.00 <a class="savebutton"><img id="c3p" src= "/public/img/c3psav.png"></a></div>
      <p id="picture"><img class= "image-size" src="${event.images.length ? event.images[0].sizes.medium.url : 'https://josselyn.org/wp-content/themes/qube/assets/images/no-image/No-Image-Found-400x264.png'}" alt="${event.name}" /></p>
      <div id="description"><span class="font">Description:</span> ${event.snippet}</div>
    </div>
   </div>`;
        })
        .join("");
      // console.log(html);
      removeCards()
      document.querySelector("#app").insertAdjacentHTML("afterbegin", html);
      makeButtons();
      scrolled();
    })
    .catch((error) => {
      console.log("error", error);
    });
}
