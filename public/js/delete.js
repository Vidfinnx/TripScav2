
//Auto Scroll to Displayed Cards
var display = document.getElementById("app");

function scrolled(){
  display.scrollIntoView(true);
}





function removeStuff() {
    const delbuttons = document.querySelectorAll(".savebutton")
    for (var i = 0; i < delbuttons.length; i++)
        delbuttons[i].setAttribute("id", i)
    for (var i = 0; i < delbuttons.length; i++)
        delbuttons[i].addEventListener('click', remove)
    // console.log(delbuttons);


    var sitesarray = [];
    var sites = document.querySelectorAll("#site");
    for (var i = 0; i < sites.length; i++)
        sitesarray.push(sites[i].innerText);
    // console.log(sitesarray);

    var cardsarray = [];
    var cards = document.getElementsByClassName("user");
    for (var i = 0; i < cards.length; i++)
    cards[i].setAttribute("id", i)
        cardsarray.push(cards);
    console.log(cardsarray);

    


    async function remove(event) {
        console.log("==-=-=-=-=")
        console.log(event.target);
        x = event.target.parentElement.id

        const site = sitesarray[x];
        console.log('+++++')
        console.log(site);

        const response = await fetch(`/api/post/remove`, {
            method: 'DELETE',
            body: JSON.stringify({
                site,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            location.reload();
        } else {
            alert(response.statusText);
        }

    }
}