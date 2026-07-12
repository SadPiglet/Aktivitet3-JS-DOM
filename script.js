/* ======================================
   MH WILDS - BUILD CHECKLISTA
   Aktivitet 3: JavaScript, DOM & interaktivite
   ====================================== */

/* --- 1. DOM-element (hämta från HTML) --- */

let buildsContainer = document.querySelector("#builds-container");

let buildNameInput = document.querySelector("#build-name-input");

let addBuildBtn = document.querySelector("#build-btn");

/* --- 2. Variabler --- */

// Array som lagrar alla builds
let builds = [];

// Array med namnen på de 6 gear slotsen i MH Wilds
let slots = ["Weapon", "Head", "Chest", "Arms", "Waist", "Legs"]


/* --- 3. Spara och ladda (localStorage) --- */

// Spara till webbläsaren. Funktion som sparar data
function saveBuilds() {
    localStorage.setItem("mhwilds-builds", JSON.stringify(builds)); // Sparar data i webbläsarens minne och gör om arrayen till text eftersom localStorage endast kan spara text.
}

// Ladda builds från webbläsaren. Funktion som hämtar tillbaka sparad data
function loadBuilds() {
    let saved = localStorage.getItem("mhwilds-builds"); // Hämtar texten med nyckel "mhwilds-builds"
    if (saved) { // Om det finns något sparat
        builds = JSON.parse(saved); // Gör om texten till en array igen
    }
}

/* --- 4. Renderar alla builds --- */
function renderBuilds() {

    // Töm container så dem inte dupliceras
    buildsContainer.innerHTML = "";

    // Loopa igenom varje build
    builds.forEach(function(build, buildIndex) {

        // Skapa ett kort för denna build
        let card = document.createElement("div"); // DOM-manipulation. Skapar ett nytt HTML-element
        card.className = "build-card"; // Ger elementet en CSS-klass

        // Skapa rubrik med build-name
        let heading = document.createElement("h2");
        heading.textContent = build.name; 
        card.appendChild(heading); // Lägger in rubriken i kortet

        // Loopa igenom alla 6 gear slots
        slots.forEach(function(slotName, slotIndex) {

            // Skapa en rad för denna slot
            let row = document.createElement("div");
            row.className = "slot-row";

            // Label (t.ex. "Weapon")
            let label = document.createElement("span");
            label.className = "slot-label";
            label.textContent = slotName;
            row.appendChild(label);

            // Input-fält
            let input = document.createElement("input");
            input.type = "text";
            input.className = "slot-input";
            input.placeholder = "Input item...";
            row.appendChild(input);

            // Knapp för att lägga till item
            let btn = document.createElement("button");
            btn.className = "slot-btn";
            btn.textContent = "+";

            // Koppla knappen till addItem funktionen. addEventListener lyssnar efter klick på knappen och anropar funktionen.
            btn.addEventListener("click", function() {
                addItem(buildIndex, slotIndex, input);
            });

            row.appendChild(btn);

            card.appendChild(row);

            // Visa sparade items för denna slot
            let itemList = document.createElement("div");
            itemList.className = "item-list";

            // Filtrera ut items som tillhör denna slot
            build.items.forEach(function(item, itemIndex) {
                if (item.slot === slotName) {

                    let itemLabel = document.createElement("label");
                    let itemCheckbox = document.createElement("input");
                    itemCheckbox.type = "checkbox";
                    itemCheckbox.checked = item.done;

                    // Event: Toggla done
                    itemCheckbox.addEventListener("change", function() {
                        item.done = itemCheckbox.checked;
                        if (item.done) {
                            itemLabel.classList.add("done");
                        } else {
                            itemLabel.classList.remove("done");
                        }
                        saveBuilds();
                    });

                    itemLabel.appendChild(itemCheckbox);
                    itemLabel.appendChild(document.createTextNode(" " + item.name));

                    if (item.done) {
                        itemLabel.classList.add("done");
                    }
                    
                    // Ta bort-knapp
                    let deleteBtn = document.createElement("button");
                    deleteBtn.textContent = "Delete";
                    deleteBtn.className = "delete-btn";
                    deleteBtn.addEventListener("click", function(){
                        deleteItem(buildIndex, slotName, itemIndex);
                    });
                    itemLabel.appendChild(deleteBtn);

                    itemList.appendChild(itemLabel);
                }
            });

            card.appendChild(itemList);
        });

        

        // Lägg till kortet i container
        buildsContainer.appendChild(card);
    });
}

/* --- 5. Lägg till item i en slot och ta bort item--- */
function addItem(buildIndex, slotIndex, inputElement) { // Tar emot 3 parametrar

    // Hämta texten från input-fältet
    let itemName = inputElement.value.trim();

    // Om input är tom så avbryt funktionen
    if (itemName === "") return;

    // Skapa item-objekt
    let item = {
        name: itemName,
        slot: slots[slotIndex],
        done: false,
    };

    // Lägg till item i rätt build
    builds[buildIndex].items.push(item);

    // Rensa input-fältet
    inputElement.value = "";

    // Spara och rendera om
    saveBuilds();
    renderBuilds();
}

/* --- Ta bort ett item --- */
function deleteItem(buildIndex, slotName, itemIndex) {

    // Hämta rätt build
    let build = builds[buildIndex];

    // Filtrera bort item:et som ska tas bort
    // Behåller alla items som INTE matchar både slot och index
    let slotItems = [];
    build.items.forEach(function(item) {
        if (item.slot === slotName) {
            slotItems.push(item);
            }
    });

    // Ta bort item på position itemIndex i slotItems
    let itemToRemove = slotItems[itemIndex];

    // Filtrera bort exakt detta item från build.items
    build.items = build.items.filter(function(item) {
        return item !== itemToRemove;
    });

    // Spara och rendera om
    saveBuilds();
    renderBuilds();
}

/* --- 6. Skapa ny build --- */
function addBuild() {

    // Hämta texten från input-fältet
    let name = buildNameInput.value.trim();

    // Om input är tomt gör inget
    if (name === "") return;

    // Skapa build objekt
    let build = {
        name: name,
        items: []
    };

    // Lägg till build i arrayen
    builds.push(build);

    // Rensa input-fältet
    buildNameInput.value = "";

    // Spara och rendera om
    saveBuilds();
    renderBuilds();
}

/* --- 7. Event-lyssnare för add build button --- */

// När knappen klickas kör addBuild funktionen
addBuildBtn.addEventListener("click", addBuild);

/* --- 8. Start --- */

// Ladda sparade builds
loadBuilds();

// Om inga builds finns skapa en tom start-build
if (builds.length === 0) {
    builds.push({
        name: "New Build",
        items: []
    });
}

// Renderar allt på sidan
renderBuilds();