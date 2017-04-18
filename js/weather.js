const getLocation = new Promise(function(resolve, reject) {
  const locationUrl = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json';

  if ( canGetData() ) {
    httpRequest(locationUrl, function(data) {
      console.log('getting location ...');
      const result = JSON.parse(data);
      if (result.ret === 1) {
        const location = result.city;
        localStorage.city = location;
        localStorage.time = new Date().getTime();
        resolve(location);
      } else {
        console.log('There\'s something wrong with the process of getting the location ...');
        resolve(localStorage.city);
      }
    });
  } else {
    render(localStorage.weatherData);
  }

});

getLocation.then(getWeather);



function canGetData() {
  const intervalTime = 3 * 60 * 60 * 1000;
  if (!localStorage.time || !localStorage.city || !localStorage.weatherData || new Date().getTime() - localStorage.time > intervalTime) {
    return true;
  } else {
    return false;
  }
}


function getWeather(location) {
  console.log('getting weather ...');

  const weatherUrl = 'https://free-api.heweather.com/v5/weather?city=' + location + '&key=f7ae61dc2f6e4be78b59dc57b1f8cf3a';
  httpRequest(weatherUrl, render);
}


function render(weatherData) {
  console.log('rendering weather ...');
  localStorage.weatherData = weatherData;

  const weather = JSON.parse(weatherData),
        data = weather.HeWeather5[0],
        tpl = '<div id="weather-box">'
            +   '<div class="weather-now">'
            +     '<p>' + data.now.tmp +'℃</p>'
            +     '<img src="images/' + data.now.cond.code + '.png" alt="weather">'
            +   '</div>'
            +   '<div class="forecast">'
            +     '<div class="today">'
            +       '<h3>今天</h3>'
            +       '<img src="images/' + data.daily_forecast[0].cond.code_d + '.png" alt="weather">'
            +       '<h4>' + data.daily_forecast[0].cond.txt_d + '</h4>'
            +       '<p><span class="min">' + data.daily_forecast[0].tmp.min + '℃</span> - <span class="max">' + data.daily_forecast[0].tmp.max + '℃</span></p>'
            +       '<p class="rainy">降雨概率：<span class="pop">' + data.daily_forecast[0].pop + '%</span></p>'
            +     '</div>'
            +     '<div class="tomorrow">'
            +       '<h3>明天</h3>'
            +       '<img src="images/' + data.daily_forecast[1].cond.code_d + '.png" alt="weather">'
            +       '<h4>' + data.daily_forecast[1].cond.txt_d + '</h4>'
            +       '<p><span class="min">' + data.daily_forecast[1].tmp.min + '℃</span> - <span class="max">' + data.daily_forecast[0].tmp.max + '℃</span></p>'
            +       '<p class="rainy">降雨概率：<span class="pop">' + data.daily_forecast[1].pop + '%</span></p>'
            +     '</div>'
            +     '<div class="day-after-tomorrow">'
            +       '<h3>后天</h3>'
            +       '<img src="images/' + data.daily_forecast[2].cond.code_d + '.png" alt="weather">'
            +       '<h4>' + data.daily_forecast[2].cond.txt_d + '</h4>'
            +       '<p><span class="min">' + data.daily_forecast[2].tmp.min + '℃</span> - <span class="max">' + data.daily_forecast[0].tmp.max + '℃</span></p>'
            +       '<p class="rainy">降雨概率：<span class="pop">' + data.daily_forecast[2].pop + '%</span></p>'
            +     '</div>'
            +   '</div>'
            +   '<div class="info">'
            +     '<p>' + data.basic.city + '</p>'
            +     '<p>天气更新时间：' + data.basic.update.loc + '</p>'
            +   '</div>';

  chrome.browserAction.setBadgeText({text: data.now.tmp + '℃'});
  document.querySelector('body').innerHTML = tpl;
}


function httpRequest(url, callback) {
  var xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      callback(xhr.responseText);
    }
  }
  xhr.send();
}