
setInterval(function() {
  const weatherUrl = 'https://free-api.heweather.com/v5/weather?city=' + localStorage.city + '&key=yourKey';

  httpRequest(weatherUrl, function(weatherData) {
    const data = JSON.parse(weatherData).HeWeather5[0];
    chrome.browserAction.setBadgeText({text: data.now.tmp + '℃'});
  });

}, 4*60*60*1000);

chrome.browserAction.setBadgeBackgroundColor({color: [28, 0, 0, 125]});