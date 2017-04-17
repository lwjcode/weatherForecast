	//用百度地图API获得当前所在城市
	var map = new BMap.Map('map');
	var myCity = new BMap.LocalCity();
	var cityName;
	myCity.get(myFun); //异步获得当前城市
	function myFun(result){
		cityName = result.name.replace('市', '');
	}

	//动态创建script标签
	function jsonp(url){
	    var script = document.createElement('script');
	    script.src = url;
	    document.body.append(script);
	    document.body.removeChild(script);
	}

	//设置延时，因为获得当前城市所在地是异步的
	setTimeout(function(){
		var urls = []; 
	    urls[0] = 'http://sapi.k780.com/?app=weather.future&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json&jsoncallback=getWeather_week&weaid=' + encodeURI(cityName);
	    urls[1] = 'http://api.map.baidu.com/telematics/v3/weather?output=json&ak=FK9mkfdQsloEngodbFl4FeY3&callback=getTodayWeather&location=' + encodeURI(cityName);
		jsonp(urls[0]);  //jsonp跨域请求
		jsonp(urls[1]);
	}, 1000);
 
 	//获得这一周的天气， 解析json数据，写入DOM
	function getWeather_week(response) {
		var result = response.result;
		var doc = document;
		var item = doc.querySelectorAll('.item');
		var i = 0;
		for (var index in result){
			item[i].getElementsByTagName('img')[0].src = result[index].weather_icon;
			var mess = item[i].querySelector('.item-mess').getElementsByTagName('div');
			mess[0].innerHTML = result[index].weather;
			mess[1].innerHTML = result[index].temperature;
			mess[2].innerHTML = result[index].winp;
			var span = mess[3].getElementsByTagName('span');
			span[0].innerHTML = result[index].days;
			span[1].innerHTML = result[index].week;
			i++;
		}
	}

	//获得今天的天气， 解析json数据，写入DOM
	function getTodayWeather(response){
		var doc = document;
		doc.querySelector('.place').innerHTML = response.results[0].currentCity;
		doc.querySelector('.date').innerHTML = response.results[0].weather_data[0].date;
		var p = doc.getElementsByTagName('p');
		var result = response.results[0].index;
		var today = response.results[0].weather_data[1];
		var i = 0;
		for (var index in result){
			for (var item in result[index]){
				if (item == 'des'){
					p[i].innerHTML = result[index][item];
					i++;
				}
			}
		}

		var daypic = doc.getElementById('day-pic');
		var nightpic = doc.getElementById('night-pic');
		var weatherspan = doc.querySelector('.weather-mess');
		var span = weatherspan.getElementsByTagName('span');
		daypic.src = today.dayPictureUrl;
		nightpic.src = today.nightPictureUrl;
		span[0].innerHTML = today.weather;
		span[1].innerHTML = today.wind;
		span[2].innerHTML = today.temperature;
		span[3] = response.results[0].pm25;
	}

	//添加事件，查询天气
	document.getElementById('search').addEventListener('click', function (){
		var cityname = document.getElementById('input-weather').value;
		if (cityname != ''){
			var urls = []; 
	    	urls[0] = 'http://sapi.k780.com/?app=weather.future&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json&jsoncallback=getWeather&weaid=' + encodeURI(cityname);
	    	urls[1] = 'http://api.map.baidu.com/telematics/v3/weather?output=json&ak=FK9mkfdQsloEngodbFl4FeY3&callback=getTodayWeather&location=' + encodeURI(cityname);
			jsonp(urls[0]);
			jsonp(urls[1]);
		}
	}, true);
