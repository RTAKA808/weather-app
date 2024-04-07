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




button.addEventListener('click',function(event){
event.preventDefault();

let city=searchBox.value
let storedWeather={
    location:searchBox.value
}
let history=JSON.parse(localStorage.getItem('locations'))
if(!history){
    history=[]
}
history.push(storedWeather)

if(!storedWeather.location){
    alert('Please enter a location')
}else{
localStorage.setItem('locations',JSON.stringify(history))
searchBox.value=''
}




let url =`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAppAPIKey}`

fetch(url).then(function(response){
    return response.json();
}).then(function(data){
    fiveDayRender(data);
    console.log("--------- First request with geolocation --------")
    console.log(data);

    const latitude = data[0].lat;
    const longitude = data[0].lon;
    console.log(latitude, longitude);

    const url2 = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAppAPIKey}`
    fetch(url2).then(function(response2) {
        return response2.json();
    }).then(function(data2){
        console.log("--------- Second request with forecase --------")
        console.log(data2);
        console.log(data2.weather[0].icon)
    

//create task card
    today.innerHTML=""
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
    cityName.innerHTML=city
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
})

function createCard(day){
    cards.innerHTML=''
    for(let i=0; i<day.length;i++){ //loops through array and displays the dates as objects
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
        }
}






function fiveDayRender(firstFetch){
let latitude=firstFetch[0].lat
let longitude=firstFetch[0].lon
let fiveDayUrl=`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherAppAPIKey}`
fetch(fiveDayUrl).then(function(response){
    console.log(firstFetch)
    return response.json();
}).then(function(data){
    console.log("5day fetch")
    console.log(data);
  
    let dates=data.list
    let day=dates.reduce((array,date)=>{
    if(array.map(date.dt_txt.split(' ')[0])){
        array.push(date)
    }
    return array
      
        // if(date.dt_txt.split(" ")[1]=== "00:00:00"){ //created a new array that only holds the information with the time being 00:00:00
        // return date
        // }
    },[])
   createCard(day)
   console.log(day)

})

}

