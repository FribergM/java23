const menuUrl = "./data/menu.json";
const specialsUrl = "./data/specials.json";
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const currentDay = new Date().getDay();
const priorDay = getYesterday();
const today = weekdays[currentDay];
const yesterday = weekdays[priorDay];
const specialState = {specialAlreadyRendered: false}

main();

function main(){
    handleMenu();
    handleSpecial();
    handleSidebar();
}
async function handleSidebar(){

}

async function handleSpecial(){
    const specialsData = await fetchData(specialsUrl);

    const weeklySpecials = specialsData.weeklySpecialsMenu;
    const todaysSpecials = weeklySpecials[today];
    
    let specialToRender = filterSpecials(todaysSpecials)

    let isTodaysSpecial = true;

    renderSpecial(specialToRender, isTodaysSpecial);
    
    const buttonYesterday = document.querySelector('.button--specials');

    buttonYesterday.addEventListener('click', () => {
        
        isTodaysSpecial = !isTodaysSpecial;
        buttonYesterday.textContent = isTodaysSpecial ? "Gårdagens" : "Dagens";
        
        if(isTodaysSpecial){
            specialToRender = filterSpecials(todaysSpecials);
        }else{
            const yesterdaysSpecials = weeklySpecials[yesterday];
        
            specialToRender = filterSpecials(yesterdaysSpecials)
        }
        
        renderSpecial(specialToRender,isTodaysSpecial);
    })
}

function filterSpecials(daysSpecials){
    const lunchTime = "11:00-14:00";
    const dinnerTime = "17:00-20:00";
    const currentHour = new Date().getHours();
    let special;
    let isLunch;

    if(currentHour < 11){
        special = daysSpecials.filter(special => special.time === lunchTime)[0];
        isLunch = true;
    }else{
        special = daysSpecials.filter(special => special.time === dinnerTime)[0];
        isLunch = false;
    }
    return {special, isLunch}
}

function renderSpecial(specialToRender, isTodaysSpecial){
    //TODO Refactor into multiple functions if I have time.
    const special = specialToRender.special;
    const isLunch = specialToRender.isLunch;

    if(!special) return;

    const loadGif = document.querySelector('#js-loading');
    loadGif.classList.add('hidden');

    const specialsContainer = document.querySelector('#specials__content');
    specialsContainer.classList.add('specials__content--loaded');

    const specialsH2 = document.querySelector('#specials-title');

    let dayText = isTodaysSpecial ? "Dagens": "Gårdagens";
    specialsH2.textContent = isLunch ? 
        `${dayText}`+" Lunch 11:00 - 14:00" : 
        `${dayText}`+" Middag 17:00 - 20:00";

    if(!specialState.specialAlreadyRendered){
        const specialsContainer2 = document.createElement('div');
        specialsContainer2.classList.add('specials__header');
        const dishName = document.createElement('p');
        dishName.id = 'dishName';
        const dishPrice = document.createElement('p');
        dishPrice.id = 'dishPrice';
        const dishDesc = document.createElement('p');
        dishDesc.id = 'dishDesc'
        
        specialsContainer2.appendChild(dishName);
        specialsContainer2.appendChild(dishPrice);
        specialsContainer.appendChild(specialsContainer2);
        specialsContainer.appendChild(dishDesc);
    }
    
    document.querySelector('#dishName').textContent = `${special.name}`;
    document.querySelector('#dishPrice').textContent = `${special.price + "kr"}`;
    document.querySelector('#dishDesc').textContent = `${special.description}`;

    specialState.specialAlreadyRendered = true;
}

/******************************************************
Normal menu
 ******************************************************/

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

function getYesterday(){
    let day = currentDay-1;
    if(day < 0){
        day = 6;
    }
    return day;
}