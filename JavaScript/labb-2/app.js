const menuUrl = "./data/menu.json";
const specialsUrl = "./data/specials.json";
const currentDay = new Date().getDay();
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weekdaysSwe = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];
const today = weekdays[currentDay];
const todaySwe = weekdaysSwe[currentDay];

main();

function main(){
    handleMenu();
    handleSpecial();
}

async function handleSpecial(){
    const specialsData = await fetchData(specialsUrl);

    const weeklySpecials = specialsData.weeklySpecialsMenu;
    const todaysSpecials = weeklySpecials[today];
    const lunchTime = "11:00-14:00";
    const dinnerTime = "17:00-20:00";

    console.log(new Date().getHours())
    const currentHour = new Date().getHours();

    let specialToRender;
    let isLunch;

    if(currentHour < 11){
        //render lunch special
        specialToRender = todaysSpecials.filter(special => special.time === lunchTime)[0];
        console.log(specialToRender.name)
        
        isLunch = true;
        renderSpecial(specialToRender,isLunch);
    }else{
        //render dinner special
        specialToRender = todaysSpecials.filter(special => special.time === dinnerTime)[0];
        console.log(specialToRender)

        isLunch = false;
        renderSpecial(specialToRender,isLunch);
    }
}

function renderSpecial(special, isLunch){

    if(special){
        const loadGif = document.querySelector('#js-loading');
        loadGif.classList.add('hidden');
    }

    const specialsContainer = document.querySelector('#specials__content');
    specialsContainer.classList.add('specials__content--loaded');

    const specialsH2 = document.querySelector('#specials-title');



    if(isLunch){
        specialsH2.textContent = "Dagens Lunch 11:00 - 14:00";
    }else{
        specialsH2.textContent = "Dagens Middag 17:00 - 20:00";
    }

    const specialsContainer2 = document.createElement('div');
    specialsContainer2.classList.add('specials__header');
    const dishName = document.createElement('p');
    const dishPrice = document.createElement('p');
    const dishDesc = document.createElement('p');

    dishName.textContent = `${special.name}`;
    dishPrice.textContent = `${special.price + "kr"}`;
    dishDesc.textContent = `${special.description}`;
    
    
    specialsContainer2.appendChild(dishName);
    specialsContainer2.appendChild(dishPrice);
    specialsContainer.appendChild(specialsContainer2);
    specialsContainer.appendChild(dishDesc);

    // TODO CONTINUE HERE

    
}

async function handleMenu(){
    const menuData = await fetchData(menuUrl);

    const grillMenu = menuData.Grill;
    const snacksMenu = menuData.Snacks;
    const drinksMenu = menuData.Drycker;

    const menuButtons = document.querySelectorAll('.options');

    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonValue = this.value; 
    
            setActiveButton(this);

            if (buttonValue === "Grill") {
                renderMenu(grillMenu, "Grill");
            } else if (buttonValue === "Snacks") {
                renderMenu(snacksMenu, "Snacks");
            } else if (buttonValue === "Drycker") {
                renderMenu(drinksMenu, "Drycker");
            }
        });
    });

    setActiveButton(menuButtons[0]);
    renderMenu(grillMenu, "Grill");

}

async function fetchData(url){
    const data = await fetch(url)
    .then(response => response.json());

    return data;
}

function renderMenu(menu, menuTitle){
    const menuContainer = document.querySelector('#content');
    menuContainer.textContent = null;
    const menuHeader = document.createElement('h2');
    menuHeader.textContent = menuTitle;
    
    const menuUl = document.createElement('ul');

    menuContainer.appendChild(menuHeader);
    menuContainer.appendChild(menuUl);
    
    menu.forEach(item => {
        const menuLi = document.createElement('li');
        menuLi.classList.add('menu__option');

        const menuItemContainer = document.createElement('div');
        menuItemContainer.classList.add('menu__title');

        const dishName = document.createElement('h3');
        dishName.classList.add('dish__name');
        dishName.textContent = item.name;

        const separator = document.createElement('div');
        separator.classList.add('separator');

        const dishPrice = document.createElement('h3');
        dishPrice.classList.add('dish__price');
        dishPrice.textContent = item.price +"kr";
        
        const description = document.createElement('p');
        description.textContent = item.description;

        menuItemContainer.appendChild(dishName);
        menuItemContainer.appendChild(separator);
        menuItemContainer.appendChild(dishPrice);

        menuLi.appendChild(menuItemContainer);
        menuLi.appendChild(description);
    
        menuUl.appendChild(menuLi);
    });
}

function setActiveButton(activeButton){
    const menuButtons = document.querySelectorAll('.options');
    menuButtons.forEach(button => {
        button.classList.remove('options--active');
    });

    activeButton.classList.add('options--active');
}