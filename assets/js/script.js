// form inputs
//display current and future conditions/saved to search history
//current weather for selected city
///city name, date, icon,temperature, humidity, windspeed  ( weather/icon)
//5 day forcast 
//clickable history

const searchBox = document.querySelector('#searchBox')
const today = document.querySelector('#today')
const fiveDay = document.querySelector('#fiveDay') 
const cards= document.querySelector('#cards')
const button=document.querySelector('#button')
const weatherAppAPIKey = "d3544544038162ae81f0a4e78fb687cd"
const historyBtn=document.querySelector('.history')
let history=[]


button.addEventListener('click',function(event){
event.preventDefault();

let city=searchBox.value
if(!JSON.parse(localStorage.getItem('locations'))){
    localStorage.setItem('locations',JSON.stringify(history))
}
// let storedWeather={
//     location:searchBox.value
// }
// let history=JSON.parse(localStorage.getItem('locations')) //grabs the stored city from local storage
// if(!history){
//     history=[]
// }
// history.push(storedWeather)



if(!city){// ensures there is an input
    return alert('Please enter a location')
}else{
  //assigns the previously entered cities with a key of locations to the local storage
searchBox.value=''
}
callApi(city, weatherAppAPIKey)



})

function createCard(day){  //fx to create a card for current days weather / days is the new array we made with the reduce function
    cards.innerHTML='' //clears the card before replacing it with the new data
    for(let i=0; i<5;i++){ //loops through array and displays the dates as objects . creates 5 cards because sometimes the api gives us 6 days in the forecast
        let container=document.createElement('div');
        let cityName=document.createElement('h2')
        let cardDate=document.createElement('h3');
        let temperature=document.createElement('p');
        let wind=document.createElement('p');
        let humidity=document.createElement('p');
        let icon=document.createElement('h2');
        let iconPic=day[i].weather[0].icon

    let windMPH=Math.floor(day[i].wind.speed/1.467)
    let tempF=day[i].main.temp
    let humidPer=day[i].main.humidity
    icon.innerHTML=`<img src= https://openweathermap.org/img/wn/${iconPic}@2x.png>`
    cityName.innerHTML=searchBox.value
    cardDate.innerHTML= day[i].dt_txt.split(" ")[0]
    temperature.innerHTML= `Temperature: ${tempF} F`
    wind.innerHTML=`Wind Speed: ${windMPH} MPH`
    humidity.innerHTML= `Humidity: ${humidPer} %`
    
    cards.appendChild(container)
    container.appendChild(cityName)
    container.appendChild(cardDate)
    container.appendChild(icon)
    container.appendChild(temperature)
    container.appendChild(wind)
    container.appendChild(humidity)
    container.className='fiveDiv'
        }
}





//fx to render the 5 day forecast 
function fiveDayRender(firstFetch){  //first fetch variable gets passed the data from the first api pull (firstfetch=data )
let latitude=firstFetch[0].lat
let longitude=firstFetch[0].lon
let fiveDayUrl=`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAppAPIKey}`
fetch(fiveDayUrl).then(function(response){
    console.log(firstFetch)
    return response.json();
}).then(function(data){
    console.log("5day fetch")
  
    let dates=data.list
    let day = dates.reduce((arr, date) => {   //iterating through the array. filtering out repeating dates. compares new value to the prevous value
        let currentDate = date.dt_txt.split(' ')[0]; //splits the date.dt_txt (date and time) into an array on its own and picks the index[0] item which is the date
        if (!arr.some(item => item.dt_txt.split(' ')[0] === currentDate)) { //if the prevous date is different then it pushes the current date into the array.  Array.some is looking through the empty array
            arr.push(date);
        }
        return arr;
    }, []);   //this empty array is the starting point that the dates get pushed into for comparison
   createCard(day) ///day is the new array we created with the dates that we want (new dates)
   console.log(day)

})

}



//function to render search history as buttons
function historyButtons(parseData){
   
    let historyLocal=JSON.parse(localStorage.getItem('locations'))  //grabbing locations from local storage
    console.log(history)
   
    if(!historyLocal.includes(parseData)){   ///checking local storage to see if it contains the city name
        history.push(parseData)      //if it doesnt include the city name we push the name to the empty array (history)
        localStorage.setItem('locations',JSON.stringify(history))
  
    let createButton= document.createElement('button')  //creating a button with the name of the city in storage
    historyBtn.appendChild(createButton)
    createButton.innerHTML=parseData
    console.log(parseData)
    createButton.id='histBtn'
   
    createButton.addEventListener('click',function(event){   //event listener for clicking the history buttons
        event.preventDefault();
        callApi(parseData, weatherAppAPIKey)  //fires the call api function and passes the values of the city name and weather api key


    })
}
}


function callApi(city, weatherAppAPIKey){
    let url =`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAppAPIKey}`
    
    fetch(url).then(function(response){   //fetching data from the api with the city name and longitude and latitude
        return response.json(); //gives us readable data in json format
    }).then(function(data){ //passes the readable data to the fivedayrender function
        fiveDayRender(data);
        console.log("--------- First request with geolocation --------")
        console.log(data);
       
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        console.log(latitude, longitude);
        const cityName=data[0].name
        historyButtons(cityName) //passes the city name as readable json data to the history buttons function
        const url2 = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAppAPIKey}`
        fetch(url2).then(function(response2) {   //requests the second set of data
            return response2.json();
        }).then(function(data2){
            console.log("--------- Second request with forecase --------")
            console.log(data2);
            console.log(data2.weather[0].icon)
        
    
    //create task card
        today.innerHTML=""     //clears the task card for todays weather
        let container=document.createElement('div');
        let cityName=document.createElement('h2')
        let cardDate=document.createElement('h3');
        let temperature=document.createElement('p');
        let wind=document.createElement('p');
        let humidity=document.createElement('p');
        let icon=document.createElement('h2');
        let iconPic=data2.weather[0].icon
       
       let windMPH=Math.floor(data2.wind.speed/1.467)
       let tempF=data2.main.temp
       let humidPer=data2.main.humidity
        cityName.innerHTML=data[0].name   //inputs text and information into the newly populated elements
        cardDate.innerHTML=dayjs.unix(data2.dt).format('MM-DD-YY') 
        temperature.innerHTML= `Temperature: ${tempF} F`
        wind.innerHTML=`Wind Speed: ${windMPH} MPH`
        humidity.innerHTML= `Humidity: ${humidPer} %`
    
        icon.innerHTML=`<img src= https://openweathermap.org/img/wn/${iconPic}@2x.png>`
    
    
    today.appendChild(container)
    container.appendChild(cityName)
    container.appendChild(cardDate)
    container.appendChild(icon)
    container.appendChild(temperature)
    container.appendChild(wind)
    container.appendChild(humidity)
    
    container.className='newDiv'
    cityName.className='city'
        
    })
    })
    }
    console.log(JSON.parse(localStorage.getItem('locations')))
    if(JSON.parse(localStorage.getItem('locations'))!==null && JSON.parse(localStorage.getItem('locations')).length>0){   //if there are items in local storage, fire history buttons function
        
        historyButtons()
    }
