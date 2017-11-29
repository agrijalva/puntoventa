(function() {
    var NYLM, claerResizeScroll, conf, getRandomInt, insertI, lol, extras;

    conf = {
        cursorcolor: "#696c75",
        cursorwidth: "4px",
        cursorborder: "none"
    };

    lol = {
        cursorcolor: "#cdd2d6",
        cursorwidth: "4px",
        cursorborder: "none"
    };

    extras = {
        cursorcolor: "#cdd2d6",
        cursorwidth: "4px",
        cursorborder: "none"
    };

    NYLM = [":)", "hola 2", "hola 3", "hola 4", "Este es un ejemplo de un texto mas largo de lo comun", "Hola 6", "Hola 7", "Hola 8", "Hola 9", "Hola 10", "Hola 11", "Hola 12", "Hola 13", "Hola 14"];

    getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    claerResizeScroll = function() {
        $("#texxt").val("");
        $(".messages").getNiceScroll(0).resize();
        return $(".messages").getNiceScroll(0).doScrollTop(999999, 999);
    };

    insertI = function() {
        var innerText, otvet;
        innerText = $.trim($("#texxt").val());
        if (innerText !== "") {
            $(".messages").append("<li class=\"i\"><div class=\"head\"><span class=\"time\">" + (new Date().getHours()) + ":" + (new Date().getMinutes()) + " AM, Hoy</span><span class=\"name\"> Agente</span></div><div class=\"message\">" + innerText + "</div></li>");
            claerResizeScroll();
            return otvet = setInterval(function() {
                $(".messages").append("<li class=\"friend-with-a-SVAGina\"><div class=\"head\"><span class=\"name\">Alejandro Grijalva Antonio  </span><span class=\"time\">" + (new Date().getHours()) + ":" + (new Date().getMinutes()) + " PM, Hoy</span></div><div class=\"message\">" + NYLM[getRandomInt(0, NYLM.length - 1)] + "</div></li>");
                claerResizeScroll();
                return clearInterval(otvet);
            }, getRandomInt(2500, 500));
        }
    };

    showList = function(){        
        var ancho = window.innerWidth;

        if( ancho <= 640 ){
            $(".left-menu").show();
            $('.chat').animate({ 'marginLeft': ancho + 'px'}, 400);
            setTimeout( function(){ 
                $(".chat").hide();
            },400 );

            $('.left-menu').animate({ 'marginLeft': '0px'}, 400);            
        }
    }

    showChat = function(){
        var ancho = window.innerWidth;

        if( ancho <= 640 ){
            $(".chat").show();
            $('.chat').animate({ 'marginLeft': '0px'}, 400);
            setTimeout( function(){ 
                $(".left-menu").hide();
            },400 );

            $('.left-menu').animate({ 'marginLeft': '-'+ ancho +'px'}, 400);
        }
    }

    var extraOpen = false;
    showExtra = function( val ){
        switch( val ){
            case 1: // Buscar
                $(".x-titulo").text("Búsqueda");
                $(".x-busqueda").show();
                $(".pnl-busqueda").show();

                $(".pnl-declaraciones").hide();
                $(".pnl-estados").hide();
                $(".pnl-saldos").hide();
                break;
            case 2: // Declaraciones
                $(".x-titulo").text("Declaraciones Fiscales");
                $(".x-busqueda").hide();
                $(".pnl-busqueda").hide();

                $(".pnl-declaraciones").show();
                $(".pnl-estados").hide();
                $(".pnl-saldos").hide();

                setTimeout( function(){ $(".docs_loading").hide(); },1000 );
                setTimeout( function(){ load_images(); },1000 );
                setTimeout( function(){ tamanios_extras(); },1500 );
                break;
            case 3: // Estados Financieros
                $(".x-titulo").text("Estados Financieros");
                $(".x-busqueda").hide();
                $(".pnl-busqueda").hide();

                $(".pnl-declaraciones").hide();
                $(".pnl-estados").show();
                $(".pnl-saldos").hide();
                break;
            case 4: // Saldos
                $(".x-titulo").text("Saldos");
                $(".x-busqueda").hide();
                $(".pnl-busqueda").hide();

                $(".pnl-declaraciones").hide();
                $(".pnl-estados").hide();
                $(".pnl-saldos").show();
                break;
        }
        if( window.innerWidth < 1025 ){
            $(".chat").css('display','none');
            $(".extra").css('display','block');
            $(".extra").css('width','70%');
        }
        else{
            $(".extra").css('width','40%');
            $(".extra").show('fast');
        }
        extraOpen = true;
        $("#search_mensaje").focus();
    }

    hideExtra = function(){
        if( window.innerWidth < 1025 ){
            $(".chat").css('display','block');
            $(".extra").css('display','none');
        }
        else{            
            $(".extra").hide('fast');
        }
        extraOpen = false;
    }

    showRecord = function(){
        $("#texxt").hide();
        $(".recording").show();
        $(".fa-microphone").hide();
        $(".fa-times").show();
    }

    hideRecord = function(){
        $("#texxt").show();
        $(".recording").hide();
        $(".fa-microphone").show();
        $(".fa-times").hide();
    }

    $(document).ready(function() {
        $(".list-friends").niceScroll(conf);
        // $(".pnl-declaraciones").niceScroll(conf);
        $(".messages").niceScroll(lol);

        $("#texxt").keypress(function(e) {
            if (e.keyCode === 13) {
                insertI();
                return false;
            }
        });


        // showExtra(2);
        return $(".send").click(function() {
            return insertI();
        });

    });

    $( window ).resize(function() {
        if(extraOpen){
            $(".chat").css('display','block');
            $(".extra").css('width','40%');
        }

        if( window.innerWidth < 1025 ){
            $(".chat").css('display','none');
            $(".extra").css('width','70%');
        }

        tamanios_extras();        
    });

    var tamanios_extras = function(){
        $(".doc-item").height( $(".pnl-declaraciones").height() / 7 - 30);
        $(".doc-item").width( $(".pnl-declaraciones").width() / 3 - 35);
    }
}).call(this);