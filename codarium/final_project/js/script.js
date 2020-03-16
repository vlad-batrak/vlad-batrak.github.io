// Отслеживаем событие скролинга
window.onscroll = function() {
    if (document.documentElement.scrollTop > window.innerHeight*0.5) {		// Если проскролили более 50% высоты окна
        document.getElementById("btnUp").style.display = "block";			// то показываем кнопку "Вверх"
    } else {
        document.getElementById("btnUp").style.display = "none";			// иначе прячем
    }
}


// Функция-прослушиватель форм на изменения и валидацию
function startFormListener() {
	// Собираем все формы со страницы в HTML-коллекцию
	let forms = document.getElementsByClassName('needs-validation');
	// Запускаем обработку коллекции форм, согласно функции
	let validation = Array.prototype.filter.call(forms, 
		function(form) { // берем по очереди формы из коллекции forms
			// Выделяем из текущей формы коллекцию полей ввода
			let controls = form.getElementsByClassName('form-control');
			// Запускаем обработку коллекции контролов, согласно функции
			let validation = Array.prototype.filter.call(controls, 
				function(control) {  // берем по очереди каждый контрол
					control.addEventListener('input',   // отслеживаем событие input - случается после каждого изменения формы
						function(event) {
					        if (control.checkValidity() === true) {		// если значение поля валидно 
					        	control.classList.remove('is-invalid');		// удаляем пометку invalid
								if (!control.classList.contains('is-valid')) control.classList.add('is-valid');  // ставим пометку valid, если такой еще нет
					        } else {									// если не валидно
					        	control.classList.remove('is-valid');	// удаляем пометку valid
					        	if (!control.classList.contains('is-invalid')) control.classList.add('is-invalid');  // ставим пометку invalid, если такой еще нет
					        }
						}, false	// возвращаем, если не обработался
					);
				}
			);

			// Если пользователь ничего не вводил, а сразу нажал кнопку Отправить
			form.addEventListener('submit',   // отслеживаем событие нажатия кнопки submit
				function(event) {
			        if (form.checkValidity() === false) {  // если форма не валидна
			          event.preventDefault();	// останавливаем обработку браузером
			          event.stopPropagation();  // прекращаем дальнейшую передачу событие submit
			        }
			        form.classList.add('was-validated');  // если прошли предыдущее условие, то дописываем в имена классов пометку о валидации
				}, false
			);

		}
	);
}


// Функция динамического наполнения страницы портфолио фотографиями
function createPhotos() {

	let gallery = document.getElementById("gallery");
	let n_photo = 30;	// количество фото в папке portfolio
	let path = '../img/portfolio/';


	let f = 1;
	let text = '';

	while (f <= n_photo ) {
		text += `<figure class="item  wow " id="item${f}" data-wow-offset="5">
			    	<a data-fancybox="gallery" href="${path}${f}.jpg" data-srcset="${path}${f}.jpg 1x, ${path}${f}_retina.jpg 2x">
			    		<img class="img-fluid lazyload" srcset="${path}${f}.jpg 1x, ${path}${f}_retina.jpg 2x">
			    	</a>
			    </figure>`;
		f += 1;
	}

	gallery.innerHTML = text;

}


function createFeedbacks() {

	let feedback = document.getElementById("accordion");
	let n = 30;	// количество фидбеков
	let path = '../img/icons/avatar/';

	let f = 1;
	let text = '';

	while (f <= n ) {
		let female_name = ["Аня", "Таня", "Света", "Маша", "Ира", "Оля", "Даша", "Кристина", "Наташа", "Лена"];
		let male_name =   ["Коля", "Ваня", "Влад", "Игорь", "Сергей", "Владимир", "Виктор", "Саша", "Александр", "Виталий"];
		let female_surname = ["Иванова", "Петрова", "Сидорова", "Шевченко", "Сергеева", "Андреева", "Скачко", "Камчатная", "Андерсон", "Смит"];
		let male_surname = ["Петров", "Коваль", "Садовой", "Камчатный", "Васильев", "Шевченко", "Гончарук", "Козак", "Пушкин", "Губерман"];
		let ar_town = ["Покровск", "Красноармейск", "Димитров", "Мирноград", "Доброполье", "Селидово", "Родинское", "Горняк", "Днепр", "Киев"];
		let avatar;

			function randomInteger(min, max) {
			  min = Math.ceil(min);
			  max = Math.floor(max);
			  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
			}

			function randomDate(start, end) {
			    return ( new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())) ).toDateString()
			}

		// Рандомно выбираем параметры фидбека
		if (Math.random() >= 0.5) {
			name = female_name[randomInteger(0, 9)];
			surname = female_surname[randomInteger(0, 9)];
			avatar = `woman-${randomInteger(1, 14)}`;
		} else {
			name = male_name[randomInteger(0, 9)];;
			surname = male_surname[randomInteger(0, 9)];
			avatar = `man-${randomInteger(1, 36)}`;
		}
		town = ar_town[randomInteger(0, 9)];
		data = randomDate(new Date(2015, 0, 1), new Date())

		text += `<div class="card mb-3">
								<div class="card-header" role="tab" id="heading${f}">
							      <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapse${f}" aria-expanded="false" aria-controls="collapse${f}">
							        <img class="avatar mr-3" src="../img/icons/avatar/${avatar}.svg">
							        <h5 class="mb-2">
							        	<span class="user-name">${name} ${surname}</span> 
							          	<svg class="bi bi-chevron-down" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
										  <path fill-rule="evenodd" d="M3.646 6.646a.5.5 0 01.708 0L10 12.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z" clip-rule="evenodd"></path>
										</svg>
							        </h5>
							        <p class="mb-0">${town}<br>${data}<p>
							      </a>
							    </div>
								<div id="collapse${f}" class="collapse" aria-labelledby="heading${f}" data-parent="#accordion">
								  <div class="card-body text-justify">
								    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
								  </div>
								</div>
							</div>`;
		f += 1;
	}

	feedback.innerHTML = text;

}

// Функция разворачивания аккордиона с фидбеками
function expand() {
	for (let elem of document.getElementsByClassName('collapse')) {
		elem.setAttribute('class', 'collapse show');
	}
}

