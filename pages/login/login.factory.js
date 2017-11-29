var Path_Login = API_Path + '/usuario/';

app.factory( 'loginFactory', function( $http ){
	return {
        login: function( user, pass ) {
            return $http({
                url: Path_Login + 'login/',
                method: "POST",
                params: {
                    user: user,
                    pass: pass
                },
                headers: {
                	// 'Authorization': 'Basic ' + Authorization,
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});