const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const supportedCurrenciesUrl = 'https://currency-converter18.p.rapidapi.com/api/v1/supportedCurrencies';
const convertUrl = 'https://currency-converter18.p.rapidapi.com/api/v1/convert';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'c67f7c7b43msh26c7b29e8c6f400p1ac05bjsnaec74f97a06e',
        'X-RapidAPI-Host': 'currency-converter18.p.rapidapi.com'
    }
};
const getCurrency = async () => {
    try {
        const response = await fetch(supportedCurrenciesUrl, options);
        const data = await response.json();
        console.log(data); 
        for (let select of dropdowns) {
            data.forEach(currency => {
                let newOption = document.createElement("option");
                newOption.innerText = currency.symbol;
                newOption.value = currency.symbol;
                if (select.name === "from" && currency.symbol === "USD") {
                    newOption.selected = "selected";
                } else if (select.name === "to" && currency.symbol === "INR") {
                    newOption.selected = "selected";
                }
                
                select.append(newOption);
            });

            select.addEventListener("change", (evt) => {
                updateFlag(evt.target);
            });
        }
        updateExchangeRate();
    } catch (error) {
        console.error("Error fetching currencies:", error);
        msg.innerText = "Error loading currencies. Please try again later.";
    }
};
const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    try {
        msg.innerText = "Fetching exchange rate...";
        
        const queryUrl = `${convertUrl}?from=${fromCurr.value}&to=${toCurr.value}&amount=${amtVal}`;
        const response = await fetch(queryUrl, options);
        const data = await response.json();

        if (data.success) {
            const convertedAmount = data.result.convertedAmount;
            const rate = (convertedAmount / amtVal).toFixed(4);
            msg.innerText = `${amtVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
        } else {
            throw new Error(data.message || "Conversion failed");
        }
    } catch (error) {
        console.error("Error during conversion:", error);
        msg.innerText = "Error getting exchange rate. Please try again.";
    }
};
const updateFlag = (element) => {
    const currCode = element.value;
    const countryCode = getCountryCode(currCode);
    const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    const img = element.parentElement.querySelector("img");
    img.src = newSrc;
};
const getCountryCode = (currencyCode) => {
    const currencyToCountry = {
        'USD': 'US',
        'EUR': 'EU',
        'GBP': 'GB',
        'INR': 'IN',
        'AUD': 'AU',
        'CAD': 'CA',
    };
    return currencyToCountry[currencyCode] || 'US';
};
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    getCurrency();
});
const exchangeButton = document.querySelector(".fa-arrow-right-arrow-left");
if (exchangeButton) {
    exchangeButton.addEventListener("click", () => {
        const temp = fromCurr.value;
        fromCurr.value = toCurr.value;
        toCurr.value = temp;
        updateFlag(fromCurr);
        updateFlag(toCurr);
        updateExchangeRate();
    });
}