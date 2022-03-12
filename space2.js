let Planets_info = [];
let Vehicles_info = [];
const vehicleValues = [];
const planetValues = [];
let timeTaken = 0;
let select_order;

let token;
let requestBody = {
    token: "",
    "planet_names": [],
    "vehicle_names": [],
};

let planets_selected = [];
let vehicles_selected = [];

let selectedFeatures = [{
        distance: 0,
        speed: 0
    },
    {
        distance: 0,
        speed: 0
    },
    {
        distance: 0,
        speed: 0
    },
    {
        distance: 0,
        speed: 0
    }
];
let tempPlanetlist = [];
let tempVehicleList = [];
let VehicleInventory = [];

let planetChoiceEl1 = document.getElementById("Planet1");
let planetChoiceEl2 = document.getElementById("Planet2");
let planetChoiceEl3 = document.getElementById("Planet3");
let planetChoiceEl4 = document.getElementById("Planet4");

let vehicleChoiceEl1 = document.getElementById("Vehicle1");
let vehicleChoiceEl2 = document.getElementById("Vehicle2");
let vehicleChoiceEl3 = document.getElementById("Vehicle3");
let vehicleChoiceEl4 = document.getElementById("Vehicle4");

let timeParaEl = document.getElementById("TimeTaken");
let searchButtonEl = document.getElementById("searchButton");

let sectionResultPageEl = document.getElementById("sectionResultPage");

let get_data_options = {
    method: "GET"
}

let result_options = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    body: "",
};

let tokenOptions = {
    method: "POST",
    headers: {
        Accept: "application/json",
    }
};

const getToken = async () => {
    const response = await fetch("https://findfalcone.herokuapp.com/token", tokenOptions);
    const {
        token
    } = await response.json();
    //choosenList.shift()
    //console.log(token);
    requestBody.token = token;
    //console.log(requestBody);
};

getToken();

function setSelectOptions(choiceEl, remainingChoices) {
    //console.log(choiceEl)
    for (let eachPlanet of remainingChoices) {
        //console.log(eachPlanet);
        let optionEl = document.createElement("option");
        optionEl.setAttribute("value", eachPlanet);
        optionEl.textContent = eachPlanet;
        choiceEl.appendChild(optionEl);
    }
    //console.log(choiceEl);
}

function getVehiclesInventory(info) {
    for (let eachVehicle of info) {
        VehicleInventory[eachVehicle.name] = eachVehicle.total_no;
    }
    console.log(VehicleInventory);
}

const getData = async () => {
    try {
        const response = await fetch("https://findfalcone.herokuapp.com/planets");
        Planets_info = await response.json();
        for (let obj of Planets_info) {
            planetValues.push(obj.name);
        }
        const responseVehicles = await fetch("https://findfalcone.herokuapp.com/vehicles");
        Vehicles_info = await responseVehicles.json();
        for (let obj of Vehicles_info) {
            vehicleValues.push(obj.name);
        }

        tempPlanetlist = [...planetValues];
        tempVehicleList = [...vehicleValues];

        getVehiclesInventory(Vehicles_info);

        setSelectOptions(planetChoiceEl1, planetValues);
        setSelectOptions(vehicleChoiceEl1, vehicleValues);

    } catch (error) {
        alert(error);
    }
};

getData();


function getTimeTaken() {
    let timeTaken = 0;
    for (let object of selectedFeatures) {
        if (object.distance !== 0 && object.speed !== 0) {
            time = object.distance / object.speed;

        } else {
            time = 0;
        }
        timeTaken = timeTaken + time;
    }
    timeParaEl.textContent = timeTaken + " Time Taken";
}

function getDistance(planetName, index, nextOptionEL) {
    let planet_index = planetValues.indexOf(planetName);
    selectedFeatures[index].distance = Planets_info[planet_index].distance;
    if (index < 3) {
        let index_in_tempList = tempPlanetlist.indexOf(planetName);
        tempPlanetlist.splice(index_in_tempList, 1);
        setSelectOptions(nextOptionEL, tempPlanetlist);
    }

}

function getVehicelFeatures(vehicleName, index, nextOptionEL) {
    let vehicle_index = vehicleValues.indexOf(vehicleName);
    selectedFeatures[index].speed = Vehicles_info[vehicle_index].speed;
    selectedFeatures[index].max_distance = Vehicles_info[vehicle_index].max_distance;
    if (selectedFeatures[index].distance > selectedFeatures[index].max_distance) {
        alert("Vehicle maximum distance is less than distance to planet. Please select another vehicle.");
    }
    else{
        if (index < 3) {
            VehicleInventory[vehicleName] = VehicleInventory[vehicleName] - 1;
            console.log(VehicleInventory[vehicleName]);
            if (VehicleInventory[vehicleName] === 0) {
                let index_in_tempList = tempVehicleList.indexOf(vehicleName);
                tempVehicleList.splice(index_in_tempList, 1);
                setSelectOptions(nextOptionEL, tempVehicleList);
                console.log(tempVehicleList);
            } else {
                setSelectOptions(nextOptionEL, tempVehicleList);
            }
        }
    }
    
}

planetChoiceEl1.addEventListener("change", function(event) {
    let planetSelected = event.target.value;
    //console.log(event.target.name);
    choiceNumber = parseInt(event.target.name) - 1;
    planets_selected[choiceNumber] = planetSelected;
    getDistance(planetSelected, choiceNumber, planetChoiceEl2);
    getTimeTaken();
});
planetChoiceEl2.addEventListener("change", function(event) {
    let planetSelected = event.target.value;
    select_order = parseInt(event.target.name);
    planets_selected[1] = planetSelected;
    getDistance(planetSelected, 1, planetChoiceEl3);
    getTimeTaken();


});
planetChoiceEl3.addEventListener("change", function(event) {
    let planetSelected = event.target.value;
    select_order = parseInt(event.target.name);
    planets_selected[2] = planetSelected;
    getDistance(planetSelected, 2, planetChoiceEl4);
    getTimeTaken();
})

planetChoiceEl4.addEventListener("change", function(event) {
    let planetSelected = event.target.value;
    //select_order = parseInt(event.target.name);
    planets_selected[3] = planetSelected;
    getDistance(planetSelected, 3, 0);
    getTimeTaken();

    //console.log(choosenList);
});

vehicleChoiceEl1.addEventListener("change", function(event) {
    let vehicleSelected = event.target.value;
    select_order = parseInt(event.target.name);
    vehicles_selected[0] = vehicleSelected;
    getVehicelFeatures(vehicleSelected, 0, vehicleChoiceEl2);
    getTimeTaken();

});
vehicleChoiceEl2.addEventListener("change", function(event) {
    let vehicleSelected = event.target.value;
    select_order = parseInt(event.target.name);
    vehicles_selected[1] = vehicleSelected;
    getVehicelFeatures(vehicleSelected, 1, vehicleChoiceEl3)
    getTimeTaken()
});
vehicleChoiceEl3.addEventListener("change", function(event) {
    let vehicleSelected = event.target.value;
    select_order = parseInt(event.target.name);
    vehicles_selected[2] = vehicleSelected;
    getVehicelFeatures(vehicleSelected, 2, vehicleChoiceEl4)
    getTimeTaken()
});
vehicleChoiceEl4.addEventListener("change", function(event) {
    let vehicleSelected = event.target.value;
    select_order = parseInt(event.target.name);
    vehicles_selected[3] = vehicleSelected;
    getVehicelFeatures(vehicleSelected, 3, 0)
    getTimeTaken()
    //console.log(timeTaken);
    //console.log(selectedFeatures);
});

function gameStart(){
    window.location.reload();
}

function displayResult(result) {
    if (result.error === undefined) {
        if (result.status === "success") {
            resultParaEl.textContent = "Congratulations Queen Falcone is found on " + result.planet_name + ". Like the game then play again."
            let playAgainBtn = document.createElement("button");
            playAgainBtn.textContent = "Play Again";
            playAgainBtn.onclick = function() {
                gameStart();
            }
            sectionResultPageEl.appendChild(playAgainBtn);
        } else{
            resultParaEl.textContent = "Sorry Queen Flacone is not found. Don't be dissapointed. Try again."
            let playAgainBtn = document.createElement("button");
            playAgainBtn.textContent = "Play Again";
            playAgainBtn.onclick = function() {
                gameStart();
            }
            sectionResultPageEl.appendChild(playAgainBtn);
        }
    } else {
        resultParaEl.textContent = "Hi, seems like army took the wrong routes. We corrected the map for you. Please try again"
        let playAgainBtn = document.createElement("button");
            playAgainBtn.textContent = "Play Again";
            playAgainBtn.onclick = function() {
                gameStart();
            }
        resultParaEl.appendChild(playAgainBtn);
    }

}

const getResult = async () => {
    result_options.body = JSON.stringify(requestBody);
    console.log(result_options)
    try {
        const response = await fetch("https://findfalcone.herokuapp.com/find", result_options);
        const resultData = await response.json;
        displayResult(resultData)
    } catch (error) {
        resultParaEl.textContent = "An error occured please relauch the game";
        console.log(error.name);
        console.log(error.message);
        //console.log(response.code);
    }
}
let resultParaEl = document.getElementById("resultPara");

searchButtonEl.addEventListener("click", function() {
    requestBody.planet_names = planets_selected;
    requestBody.vehicle_names = vehicles_selected;
    console.log(requestBody)
    getResult(result_options);
})