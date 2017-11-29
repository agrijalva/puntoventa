var aga_prev = function () {
	$(".p-1").fadeIn();
	$(".p-2").fadeOut();
}

var aga_next = function () {	
	$(".p-2").fadeIn();
	$(".p-1").fadeOut();
}

var misImagenes = [
	{ foto: "1.jpg", anio: 2017, mes: 4},
	{ foto: "2.png", anio: 2017, mes: 4},
	{ foto: "3.jpg", anio: 2017, mes: 4},
	{ foto: "4.jpg", anio: 2017, mes: 4},
	{ foto: "5.jpg", anio: 2017, mes: 4},
	{ foto: "6.jpg", anio: 2017, mes: 4},
	{ foto: "7.jpg", anio: 2017, mes: 4},
	{ foto: "8.jpg", anio: 2017, mes: 4},
	{ foto: "9.jpg", anio: 2017, mes: 4},
	{ foto: "10.jpg", anio: 2017, mes: 4},
	{ foto: "11.jpg", anio: 2017, mes: 4},
	{ foto: "12.jpg", anio: 2017, mes: 4},
	{ foto: "13.jpg", anio: 2017, mes: 4},
	{ foto: "14.jpg", anio: 2017, mes: 4},
	{ foto: "15.jpg", anio: 2017, mes: 4},
	{ foto: "16.png", anio: 2017, mes: 4},
	{ foto: "17.jpg", anio: 2017, mes: 4},
	{ foto: "18.jpg", anio: 2017, mes: 4},
	{ foto: "19.jpg", anio: 2017, mes: 4},
	{ foto: "20.jpg", anio: 2017, mes: 4},
	{ foto: "21.jpg", anio: 2017, mes: 4},
	{ foto: "22.jpg", anio: 2017, mes: 4},
	{ foto: "1.jpg", anio: 2017, mes: 4},
	{ foto: "2.png", anio: 2017, mes: 4},
	{ foto: "3.jpg", anio: 2017, mes: 4},
	{ foto: "4.jpg", anio: 2017, mes: 4},
	{ foto: "5.jpg", anio: 2017, mes: 4},
	{ foto: "6.jpg", anio: 2017, mes: 4},
	{ foto: "7.jpg", anio: 2017, mes: 4},
	{ foto: "8.jpg", anio: 2017, mes: 4}
]

var load_images = function(){
	// if( misImagenes.length > 21 ){
		
	// }
	var contador = 0;
	$.each( misImagenes, function( item, val){
		contador++;
		clase = contador <= 21 ? 'p-1' : 'p-2';
		$(".dec-items").append('<div class="doc-item '+ clase +'"  style="background-image:url(img/ejemplos/'+ val.foto +')"> </div>');
	});	
	// if( misImagenes.lengh )
}