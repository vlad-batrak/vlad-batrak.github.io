
	//let city_url = "https://bulk.openweathermap.org/sample/city.list.min.json.gz";		// адрес файла со списком городов

	function getLastOptions() {
		// Запрашиваем из localStorage json-строку и парсим её в объект`
		let forecast_options = JSON.parse(window.localStorage.getItem("forecast_options"));

		if (forecast_options) { 
			// Если настройки есть, то вносим их в окна формы
			document.getElementById("city").value = forecast_options["city"];
			document.getElementById("days").value = forecast_options["days"];
			// Делаем запрос на прогноз
			getForecast();			
		}
	}

	function setLastOptions() {
		// Считываем значения настроек
		let city = document.getElementById("city").value;
		let days = document.getElementById("days").value;

		if (city && days) {
			// Если поля не пустые, формируем json-строку и записываем в localStorage
			window.localStorage.setItem("forecast_options",`{"city":"${city}", "days":"${days}"}`);
		} 
	}

	function getForecast() {
		let city = document.getElementById("city").value;
		let days = document.getElementById("days").value;

		if (city) { 
			// Создаем объект запроса
			xhr = new XMLHttpRequest();
			// На всякий случай проверяем успешность создания реквеста
			if (xhr) {
				// Формируем GET-запрос
				let url = new URL("https://api.openweathermap.org/data/2.5/forecast/daily"); //?q=Киев&cnt=7&appid=11c0d3dc6093f7442898ee49d2430d20&units=metric&lang=ru";
				// Передаем параметры в строку подключения
				url.searchParams.set("q", city);									// населенный пункт
				url.searchParams.set("cnt", days);									// кол-во дней для прогноза
				url.searchParams.set("appid", "11c0d3dc6093f7442898ee49d2430d20");  // api-идентификатор пользователя сервиса. Пожалуйста, зарегестрируйтесь на openweathermap.org и используйте свой appid !!!
				url.searchParams.set("units", "metric");							// европейская метрическая система измерений
				url.searchParams.set("lang", "ru");									// язык ответа

				xhr.open('GET', url, true);  // true - асинхронное выполнение, false - синхронное, т.е. сайт повисает до конца загрузки данных

				// Задаем функции-обработчики изменения состояния
				xhr.onload = loadRequestData;
				xhr.onerror = errorRequestData;
				xhr.onprogress = progressRequestData;
				// Старый, морально устаревший универсальный обработчик изменения состояния
				// xhr.onreadystatechange = processRequestData;
				// Указываем ожидаемый тип ответа
				xhr.responseType = 'json';
				// Отправляем запрос
				xhr.send();
			} else {
			    console.log("Ошибка создания XMLHttpRequest!");
			    return false;
			}
		}
	}

	// function processRequestData() {
	// 	if (this.readyState == 4) {
	// 		if (xhr.status == 200) {
	// 		  let result = JSON.parse(xhr.responseText);
	// 		  console.log(result);
	// 		} else {
	// 		  console.error("Ошибка выполнения запроса!");
	// 		}
	// 	}
	// }

	function loadRequestData() {
	    if (xhr.status == 200) {
	      // console.log(`Получено ${xhr.response.length} байт`);
	      let resp_obj = xhr.response;
	      console.log(resp_obj);
	      // Генерируем контент на странице
	      generateWeatherTable(resp_obj);
	    } else {
	      console.error(`Ошибка загрузки ${xhr.status}: ${xhr.statusText}`);
	      alert("К сожалению не удалось найти указанный населенный пункт.\nПопробуйте ввести другой ближайший.");
	    }
	}

	function errorRequestData() {
		console.error(`Запрос не может быть выполнен!\nОшибка ${xhr.status}: ${xhr.statusText}`);
		alert("Ошибка!\nЗапрос не может быть выполнен. Проверьте подключение к сети!");
	}

	function progressRequestData(event) {
		if (event.lengthComputable) {
		    console.log(`Получено ${event.loaded} из ${event.total} байт`);
		  } else {
		    console.log(`Получено ${event.loaded} байт`); // если в ответе нет заголовка Content-Length
		  }
	}

	function generateWeatherTable(json) {
		document.getElementById('main_container').innerHTML = '';
		let element = document.createElement("div");
		element.className = "location";
		element.innerHTML = `Прогноз погоды на <b>${json.cnt} дней</b> для <b>${json.city.name} (${json.city.country})</b> `;
		document.getElementById('main_container').append(element);

		element = document.createElement("div");
		element.className = "weather-table";
		element.id = "weather_table";
		document.getElementById('main_container').append(element);

		for (let day_data of json.list) {
			element = document.createElement("div");
			element.className = "day-data";
			// Указываем дату прогноза
			let date = from_unix(day_data['dt']);
			let week_day = getWeekDay(date);
			date = date.toLocaleString().split(',')[0];
			element.innerHTML = `<div class="date"><p>${week_day} </p><p>${date}</p></div>`;
			// Вставляем иконку погоды
			let iconcode = day_data['weather']['0']['icon'];
			let iconurl = `http://openweathermap.org/img/w/${iconcode}.png`;
			let desc = day_data['weather']['0']['description'];
			element.innerHTML += `<div class="icon"><img src="${iconurl}"><p>${desc}</p></div>`;
			// Заносим температуру
			let temp_night = String(Number(day_data['temp']['night']).toFixed(1));
			let temp_day = String(Number(day_data['temp']['day']).toFixed(1));
			element.innerHTML += `<div class="temp"><p>${temp_night}&deg;C / ${temp_day}&deg;C</p></div>`;
			// Заносим влажность и давление
			let humidity = day_data['humidity'];
			let pressure = day_data['pressure'];
			element.innerHTML += `<div class="hum-pres"><p>вл. ${humidity}%  |  давл. ${pressure}МПа</p></div>`;			
			// Заносим ветер
			let speed = day_data['speed'];
			let deg = String(Number(day_data['deg']) + 90); // 90 - разворот стрелки от направления ветра на 180 град. с поправкой, что стрелка не вертикальная
			element.innerHTML += `<div class="wind"><p>вет. ${speed}м/с&nbsp;&nbsp;&nbsp;</p><div class="wind-diraction" ` + 
								 `style="-webkit-transform: rotate(${deg}deg);-ms-transform: rotate(${deg}deg);transform: rotate(${deg}deg);">` +
								 `➤</div>&nbsp;&nbsp;${day_data['deg']}deg</div>`;

			// Добавляем карточку дневного прогноза в таблицу
			document.getElementById('weather_table').append(element);
		}

		//****** Вспомогательные функции работы с датой ******************
		function from_unix(seconds){
			var datum = new Date(seconds * 1000);
			return datum;
		}

		function getWeekDay(date) {
		  let days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
		  return days[date.getDay()];
		}
		//****************************************************************
		
		// Создаем блок с кнопкой для экспорта результатов рогноза в json-строку
		element = document.createElement("div");
		element.className = "json-exporter";
		element.id = "json_exporter";
		element.innerHTML = '<hr><button onclick=export2json()>Экспортировать в json</button><div class="export-str"></div>';
		document.getElementById('main_container').append(element);

		// Отображаем содержимое секции main
		document.getElementById('main_container').style.display = "flex";
	}

	function export2json() {
		// Заносим первых два ключа в итоговый json
		let city = document.getElementById("city").value;
		let days = document.getElementById("days").value;
		json_exp = {"city": city, "days": days};

		// Собираем все карточки дней в один объект
		let cards = document.getElementsByClassName("day-data");
		// Создаем пустой массив для сбора в него card_info по дням
		let arr = [];
		for (let card of cards) {  // для каждой карточки из набора карточек
			// Создаем пустой объект для сбора в него информации из карточки
			let card_info = {};
			for (let card_child of card.children) {  // для каждого дочернего блока из блока родителя (дневной карточки)
				// Собираем данные: ключ - имя блока, значение - преобразованный текст в блоке
				card_info[card_child.className] = card_child.innerHTML.replace(/(\<(\/?[^>]+)>)/g, '').replace(/[&nbsp;]*➤[&nbsp;]*/, ', ').replace(/\s*\|\s*/, ', ');
			}
			// Добавляем инфу за день в массив дней
			arr.push(card_info);
		}
		// Создаем третий ключ со значением массива объектов
		json_exp["list"] = arr;
		// Создаем поле вывода итоговой json-строки
		let element = document.createElement("samp");
		element.className = "export-str";
		element.id = "export_str";
		element.innerHTML = JSON.stringify(json_exp);
		document.getElementById('json_exporter').append(element);
		document.getElementById('export_str').style.display = "block";
		// На всякий случай логируем итоговый объект
		console.log(json_exp);
	}