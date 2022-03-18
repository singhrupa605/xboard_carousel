function convertXmlToJson(rssUrl) {
  let url = "https://api.rss2json.com/v1/api.json?rss_url=" + rssUrl;
  return url;
}

async function fetchJsonData(url) {
  try {
    const apiResponse = await fetch(url);
    const jsonData = await apiResponse.json();
    return jsonData.items;
  } catch (err) {
    return null;
  }
}
async function createDataFromMagazines(magazines) {
  let data = [];

  for (let i = 0; i < magazines.length; i++) {
    let obj = { id: "", cards: [] };
    if (i === 0) {
      obj.id = "covid";
    } else if (i === 1) {
      obj.id = "tech";
    } else {
      obj.id = "sports";
    }
    let url = convertXmlToJson(magazines[i]);
    let magazineItems = await fetchJsonData(url);
    // console.log(magazineItems);
    for (let j = 0; j < magazineItems.length; j++) {
      let card = {
        title: magazineItems[j].title,
        image: magazineItems[j].enclosure.link,
        description: magazineItems[j].description,
        source: magazineItems[j].link,
      };

      obj.cards.push(card);
    }
    data.push(obj);
  }
  return data;
}

function createCard(item) {
  let card = document.createElement("div");
  card.className = "card";

  let heading = document.createElement("h5");
  heading.className = "card-title";
  heading.textContent = item.title;

  let anchorTag = document.createElement("a");
  anchorTag.href = item.source;

  let cardImg = document.createElement("img");
  cardImg.className = "card-img-top";
  cardImg.src = item.image;

  let content = document.createElement("p");
  content.className = "card-text";
  content.textContent = item.description;
  anchorTag.append(cardImg);
  card.append(anchorTag);
  card.append(heading);
  card.append(content);
  return card;
}

function createCarousel(data) {
  // creating carousel for each magazine using data created from createDataFromMagazines(magazines) method
  for (let j = 0; j < data.length; j++) {
    console.log(data[j]);
    let container = document.getElementById(data[j].id);
    let slides = container.children[0];
    let slideId = data[j].id + "-slide";
    slides.setAttribute("id", slideId);
    slides.innerHTML = ` <div class="carousel-inner" id ="inner"></div>
     
      <button class="carousel-control-prev" type="button" data-bs-target= #${slideId} data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span> 
      </button>
      
      <button class="carousel-control-next" type="button" data-bs-target=  #${slideId} data-bs-slide="next">
      <div class = bar><span class="carousel-control-next-icon" aria-hidden="true"></span></div> 
      <span class="visually-hidden">Next</span></button>`;

    let carousel = slides.children[0];
    for (let i = 0; i < data[j].cards.length; i++) {
      //Creating carousel items(cards)
      let carouselItem = document.createElement("div");
      if (i === 0) {
        carouselItem.classList.add("carousel-item", "active");
      } else {
        carouselItem.classList.add("carousel-item");
      }

      //  console.log(data[j].cards[i])
      let card = createCard(data[j].cards[i]);
      carouselItem.append(card);
      carousel.append(carouselItem);
    }
    slides.append(carousel);
  }
}

(async function () {
  let data = await createDataFromMagazines(magazines);
  createCarousel(data);
  document.getElementById("covid").classList.add("show");
})();
