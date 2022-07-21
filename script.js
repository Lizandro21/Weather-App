//get api key then set all the variables I think ill need (if I need anymore  just add later) this uncldes api searching stuff, weather stuff and span
// and button stuff. then code the button stuff, next dont forget to test out the API key. API KEY NOT WORKING OR IM DOING IT WRONG
//figure out in 15 minutes after break. next make weather stuff after fixing apI issues. dont forget to run tests too. then figure out CSS stuff.


var APIKey="b9beb5dfb0a1b7edda4818c623191cdd";
var searchingCity;

var cityLongitude=0; 
var uviColor;
var weatherCon; 
var cityLatitute=0;
var uvIndex_local;
var temp;
var wind; 
var humidity;
 
console.log('test')


var dateOfCurrentDay=moment().format("YYYY-MM-DD");

var citySearch = $('input[name="city"]'); 
var spanOfWind=$('#wind');
var spanOfHum=$('#humidity');
var buttonsForLS=$('#search-history');
var forcastDisplay=$('#display-section');
var spanOfUVI=$('#uvi');
var forcastIcon=$('<img>');
var searchBtn =$('#search'); 
var cityHeader=$('#header-tag');
var spanOfTemp=$('#temp');

console.log('test')
console.log('hello world')

var todaysWeatherData=[];
var forcastDays=["day1","day2","day3","day4","day5"]; 

searchBtn.on('click',function(event)
{
    event.preventDefault();

    var cityInput = citySearch.val();
    var hasSpaces =cityInput.includes(" ");
    var c="";

    if(hasSpaces)
    {
        var a = cityInput.split(" ");

        for(i=0;i<a.length;i++)
        {
           c = c+a[i].charAt(0).toUpperCase()+a[i].slice(1).toLowerCase()+ " ";
        }
    }

    else
    {
        c = cityInput.charAt(0).toUpperCase()+cityInput.slice(1).toLowerCase();
    }
    

    searchingCity = c.toString();    
    if(searchingCity ==="")
    {
        window.alert("Please enter a city to obtain weather data.");
    }

    else
    {
        getTodaysWeather(searchingCity);
    }
});

buttonsForLS.on('click','button',function(event)
{
    event.preventDefault();
    var searchCity = $(event.target).attr('city');
    var currentWeather = JSON.parse(localStorage.getItem(searchCity));
    var forecastWeather = JSON.parse(localStorage.getItem("fc"+searchCity));
    var forcastIcon=$('<img>');

    citySearch.val(searchCity);
    cityHeader.text(searchCity +" "+ dateOfCurrentDay+" ");
    spanOfTemp.text(currentWeather[1]);
    spanOfWind.text(currentWeather[2]);
    spanOfHum.text(currentWeather[3]);  
    forcastIcon.attr("src",currentWeather[4]);
    spanOfUVI.text(currentWeather[5]);
    var a = currentWeather[5];

    cityHeader.append(forcastIcon);
    
    if(a<3)
    {
        uviColor="green"; 
        spanOfUVI.css("background-color", uviColor);    
    }

    else if(a>=3 && a<6)
    {
        uviColor="yellow";
        spanOfUVI.css("background-color", uviColor);   
    }

    else
    {
        uviColor="red";
        spanOfUVI.css("background-color", uviColor);  
    }

    for(i=0;i<forecastWeather.length;i++)
    {
        var fcDivision =$("#"+forcastDays[i]);
        var fcIcon=fcDivision.children().eq(1);
        var dayForecast=forecastWeather[i];
                    
        fcDate=dayForecast[0];
        fcTemp=dayForecast[1];
        fcDescription=dayForecast[2];
        fcWind=dayForecast[3];
        fcHumidity=dayForecast[4];              

        fcDivision.children().eq(0).children().eq(0).text(fcDate);
        fcDivision.children().eq(2).children().eq(0).text(fcTemp);
        fcDivision.children().eq(3).children().eq(0).text(fcWind);
        fcDivision.children().eq(4).children().eq(0).text(fcHumidity);
        fcIcon.attr("src",fcDescription);  
    }
});

function getWeatherForecast(searchingCity)
{
    var forecastUrl="https://api.openweathermap.org/data/2.5/forecast?q="+searchingCity+"&units=metric&appid="+APIKey;
    var fcDate; var fcTemp; var fcHumidity; var fcDescription; var fcWind;
    fetch(forecastUrl).then(function (response){
        if(response.ok)
        {
            response.json().then(function (data) {
            var forcastDays = ["day1","day2","day3","day4","day5"];
            var numberOfForecasts = data.list.length;
            var timeStamp = data.list[numberOfForecasts-1].dt_txt.split(" ");
            var a = timeStamp[1];
            var j = 0;

            var fcData=[];

            for(i = 0; i<numberOfForecasts; i++)
            {
                var b = data.list[i].dt_txt.split(" ");
                if(b[1]===a)
                {
                    var fcDivision =$("#"+forcastDays[j]); 
                    var fcIcon=fcDivision.children().eq(1);

                    fcDate=b[0];
                    fcTemp=data.list[i].main.temp;
                    fcHumidity=data.list[i].main.humidity;
                    fcDescription=data.list[i].weather[0].icon;
                    fcWind=data.list[i].wind.speed;                 

                    fcDivision.children().eq(0).children().eq(0).text(fcDate);
                    fcDivision.children().eq(2).children().eq(0).text(fcTemp);
                    fcDivision.children().eq(3).children().eq(0).text(fcWind);
                    fcDivision.children().eq(4).children().eq(0).text(fcHumidity);
                    fcIcon.attr("src","https://openweathermap.org/img/w/"+fcDescription+".png");
                    var c = [fcDate,fcTemp,"https://openweathermap.org/img/w/"+fcDescription+".png",fcWind,fcHumidity];
                    fcData.push(c);
                    j++;
                }
            }

            localStorage.setItem("fc"+searchingCity,JSON.stringify(fcData));
            });
        }

        else if(response.status==404)
        {
            alert("This city does not exist! Please check again.");
        }

        else
        {
            alert("Error"+response.statusText);
        }
    })
    .catch(function (error)
    {
        alert("Unable to connect to Weather");
    });
}

console.log(getWeatherForecast)
console.log('helloworld')

function showTodaysWeatherForcast(city,temp,wind,humidity,weatherCon)
{
    cityHeader.text(city +" "+ dateOfCurrentDay+" ");
    spanOfTemp.text(temp);
    spanOfWind.text(wind);
    spanOfHum.text(humidity);  
    forcastIcon.attr("src","https://openweathermap.org/img/w/"+weatherCon+".png");
    cityHeader.append(forcastIcon);


    if(todaysWeatherData.includes(city))
    {
        return;
    }

    else
    {
        var cityButton=$('<button>');
        cityButton.addClass('btn btn-secondary btn-sm');
        cityButton.text(city);
        cityButton.attr("city",city);
        buttonsForLS.append(cityButton);
    }
}
console.log(showTodaysWeatherForcast)

console.log('test')

function getTodaysUVI(lat,lon)
{
    var uviUrl= "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat+ "&lon="+ lon+ "&exclude=current,minutely,hourly,alerts&appid=" + APIKey;
    
    fetch(uviUrl).then(function (response){
        if(response.ok)
        {
            response.json().then(function (data) {
            uvIndex_local=data.daily[0].uvi;
            spanOfUVI.text(uvIndex_local);
           
            if(uvIndex_local<3)
            {
                uviColor="green"; 
                spanOfUVI.css("background-color", uviColor);   
            }

            else if(uvIndex_local>=3 && uvIndex_local<6)
            {
                uviColor="yellow";
                spanOfUVI.css("background-color", uviColor);   
            }

            else
            {
                uviColor="red";
                spanOfUVI.css("background-color", uviColor);  
            }
            
            saveForcastDataToday(searchingCity); 
            });
        }

        else if(response.status==404)
        {
            alert("This city does not exist! Please check again.");
        }

        else
        {
            alert("Error"+response.statusText);
        }
    })
    .catch(function (error)
    {
        alert("Unable to connect to Weather");
    });
}
console.log(getTodaysUVI)

console.log('test test')


function saveForcastDataToday(city)
{
    var cityTemp = city;
    var city = [];
    city[0] = dateOfCurrentDay;
    city[1] = temp;
    city[2] = wind;
    city[3] = humidity;
    city[4] = "https://openweathermap.org/img/w/"+weatherCon+".png"
    city[5] = uvIndex_local;
    city[6]= uviColor;

    localStorage.setItem(cityTemp,JSON.stringify(city));

    if(todaysWeatherData.includes(cityTemp))
    {
        localStorage.setItem('currentWeatherCity',JSON.stringify(todaysWeatherData));
    }

    else
    {
        todaysWeatherData.push(cityTemp);
        localStorage.setItem('currentWeatherCity',JSON.stringify(todaysWeatherData));
    }  
}

console.log('hello hello')

console.log(saveForcastDataToday)

function getTodaysWeather(searchingCity)
{
    var currentDataUrl="https://api.openweathermap.org/data/2.5/weather?q=" + searchingCity+ "&units=metric&appid=" + APIKey;
    
    fetch(currentDataUrl).then(function (response)
    {
        if(response.ok)
        {
            response.json().then(function (data) 
            {
                forcastDisplay.removeClass('hide');
                temp = data.main.temp; 
                wind = data.wind.speed; 
                humidity = data.main.humidity; 
                weatherCon = data.weather[0].icon;
                cityLatitute = JSON.stringify(data.coord.lat);
                cityLongitude= JSON.stringify(data.coord.lon);
                   
                showTodaysWeatherForcast(searchingCity,temp,wind,humidity,weatherCon);
                getTodaysUVI(cityLatitute,cityLongitude);
                getWeatherForecast(searchingCity);            
            });
        }

        else if(response.status==404)
        {
            window.alert("This city does not exist! Please check again.");
            citySearch.val("");
        }

        else
        {
            window.alert("Error"+response.statusText);
        }})
        
        .catch(function (error)
        {
            alert("Error :"+error);
        });
}

console.log('final test')
