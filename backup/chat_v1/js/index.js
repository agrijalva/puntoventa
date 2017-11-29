(function() {
    var NYLM, claerResizeScroll, conf, getRandomInt, insertI, lol;

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
            $(".messages").append("<li class=\"i\"><div class=\"head\"><span class=\"time\">" + (new Date().getHours()) + ":" + (new Date().getMinutes()) + " AM, Today</span><span class=\"name\"> Agente</span></div><div class=\"message\">" + innerText + "</div></li>");
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

    $(document).ready(function() {
        $(".list-friends").niceScroll(conf);
        $(".messages").niceScroll(lol);
        $("#texxt").keypress(function(e) {
            if (e.keyCode === 13) {
                insertI();
                return false;
            }
        });
        return $(".send").click(function() {
            return insertI();
        });

        // showList();
    });

}).call(this);