import axios from '../node_models/axios'

// form fields
const form = document.querySelector('.form-data');
const region = document.querySelector('.region-name');
const apiKey = document.querySelector('.api=key')

// results
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.resukt-contaioner');
const usage = document.querySelector('.carbon-usage');
const fossilfuel = document.querySelector('.my-region');
const clearBtn = document.querySelector('.clear-btn');



async function init() {
    // if anything is in localStorage, pick it up
    const storedApiKey = localStorage.getItem('apiKey');
    const storeRegion = localStorage.getItem('regionName');

    // set icon to be generic green
    chrome.runtime.sendMessage({
        action: 'updateIcon',
        value: {
            color: 'green'
        }
    });

    // todo

    if (storedApiKey === null || storeRegion === null) {
        // if we dont have the key, show the form
        form.style.display = 'block';
        results.style.display = 'none';
        loading.style.display = 'none';
        clearBtn.style.display = 'none';
        errors.textContent = '';
    } else {
        // if we have saved keys/regions in localStorage, show results when they load
        displayCarbonUsage(storedApiKey, storeRegion);
        results.style.display = 'none';
        form.style.display = 'none';
        clearBtn.style.display = 'block';
    }
};

async function reset(e) {
    e.preventDefault();
    // clear local storage for region only
    localStorage.removeItem('regionName');
    init();
}

async function handleSubmit(e) {
    e.preventDefault();
    setUpUser(apiKey.value, region.value);
}

async function setUpUser(apiKey, regionName) {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('regionName', regionName);
    loading.style.display = 'block';
    errors.textContent = '';
    clearBtn.style.display = 'block';
    // make inital call
    displayCarbonUsage(apiKey, regionName);
}

async function displayCarbonUsage(apiKey, region) {
    try {
        await axios
        .get('https://api.co2signal.com/v1/latest', {
            params: {
                countryCode: region,
            },
            headers: {
                'auth-token' : apiKey
            }
        }).then((response) => {
            let CO2 = Math.floor(response.data.data.carbonIntensity);

            calculateColor(CO2)

            loading.style.display = 'none';
            form.style.display = 'none';
            myregion.textContent = region;
            usage.textContent = 
            Math.round(response.data.data.carbonIntensity) + 'grams(grams CO2 emitted per kilowatt hour)';
            fossilfuel.textContent = 
            response.data.data.fossilFuelPercentage.toFixed(2) + '% (percentage of fossil fuels used to generate electricity)';
            results.style.display = 'block';
        });
    } catch (error) {
        console.log(error);
        loading.style.display = 'none';
        results.style.display = 'none';
        errors.textContent = 'Sorry, we have no data for the region you have requested.'
    }
}

async function calculateColor(value) {
    let co2cale = [0, 150, 600, 750, 800];
    let colors = ['#2AA364', '#F5EBD4D', '#9E4229', '#381D02', '#381D02'];

    let closesetNum = co2Scale.sort((a, b) => {
        return Math.abs(a - value) - Math.abs(b - value);
    })[0];
    console.log(value + 'is cloest to ' + clorstNum);
    let num = (element) => element > closesetNum;
    let scaleIndex = co2Scale.findIndex(num);

    let closestColor = colors[scaleIndex];
    console.log(scaleIndex, closestColor);
    
    chrome.runtime.sendMessage({action: 'updateIcon', value: {color: closestColor}});
}


form.addEventListener('submit', (e) => handleSubmit(e));
clearBtn.addEventListener('click', (e) => reset(e));
// start app
init();