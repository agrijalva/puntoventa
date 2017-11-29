-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-11-2017 a las 00:01:11
-- Versión del servidor: 10.1.21-MariaDB
-- Versión de PHP: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `asesoria`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE PROCEDURE `ADM_CTC_SP` ()  BEGIN
	SELECT * FROM catalogotipocliente;
END$$

CREATE PROCEDURE `ADM_LOGIN_SP` (IN `_user` VARCHAR(255) CHARSET utf8, IN `_pass` VARCHAR(255) CHARSET utf8)  BEGIN
	SELECT * FROM usuario 			 USU
	INNER JOIN empresa 				 EMP   ON USU.emp_id = EMP.emp_id
    INNER JOIN catalogousuario 		 CU 	  ON USU.cu_id = CU.cu_id
    INNER JOIN configuracionempresa  CONF  ON CONF.emp_id = EMP.emp_id
	WHERE CU.cu_id = 2
		  AND usu_usuario = _user
		  AND usu_password = _pass
		  AND usu_estatus = 1;
END$$

CREATE PROCEDURE `ARE_CLIENTES_TODOS_BY_EJE_SP` (IN `idEjecutivo` INT(30))  BEGIN
	SELECT DISTINCT(CAT.ca_id), CAT.ca_nombre
	FROM clientearea CA 
	INNER JOIN catalogoarea CAT ON CA.ca_id = CAT.ca_id
	INNER JOIN cliente CLI ON CLI.cli_id = CA.cli_id
	INNER JOIN clienteejecutivo CE ON CE.cli_id = CLI.cli_id
	WHERE eje_id = idEjecutivo AND clej_estatus = 1 AND clar_estatus =1;
END$$

CREATE PROCEDURE `ARE_POR_EMPRESA_SP` (IN `idEmpresa` INT(30), IN `idCliente` INT)  BEGIN	
	SELECT *,
    (SELECT COUNT(clar_id) FROM clientearea WHERE cli_id = idCliente AND ca_id = CA.ca_id AND clar_estatus = 1) as checked
	FROM empresaarea EMPAR
	INNER JOIN catalogoarea CA ON EMPAR.ca_id = CA.ca_id
	WHERE emp_id = idEmpresa;
	
END$$

CREATE PROCEDURE `CHAT_GET_CLIENTE_SP` (IN `_IdRep` INTEGER, IN `_IdEje` INTEGER, IN `LastId` INTEGER)  BEGIN
	SELECT men_id, rep_id, men_tipo_usuario as autor, men_mensaje as mensaje, 'Yo' as nombre, `timestamp` as fecha      FROM mensajes
	WHERE men_id > LastId 
		  AND eje_id = _IdEje 
          AND rep_id = _IdRep
	LIMIT 1;
END$$

CREATE PROCEDURE `CHAT_GET_EJECUTIVO_SP` (IN `_IdEje` INTEGER, IN `LastId` INTEGER)  BEGIN
	/*
    
	-- Declare local variables
   DECLARE done BOOLEAN DEFAULT 0;
   DECLARE idRep INT;
   DECLARE limite INT;
   DECLARE margenLimite INT;
   
	-- declare cursor for employee email
	DEClARE representantes CURSOR FOR 
	SELECT DISTINCT(rep_id) AS Rep FROM mensajes WHERE men_id > LastId AND  eje_id = _IdEje ORDER BY rep_id, timestamp;
	
    -- Declare continue handler
    DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done=1;
   
    OPEN representantes;
		REPEAT
		  -- Get order number
		  FETCH representantes INTO idRep;
          -- select idRep as 'valor';
			SET limite = (  SELECT COUNT(men_id) FROM mensajes
							WHERE men_id > LastId AND  eje_id = _IdEje AND rep_id = idRep);
                            
			SET margenLimite = limite - 50;
            
            IF( limite < 50 ) THEN
				SELECT * FROM mensajes
				WHERE men_id > LastId AND  eje_id = _IdEje AND rep_id = idRep ORDER BY rep_id, timestamp;
            ELSE
				SELECT * FROM mensajes
				WHERE men_id > LastId AND  eje_id = _IdEje AND rep_id = idRep ORDER BY rep_id, timestamp LIMIT margenLimite, limite;
            END IF;
            
            
	   -- End of loop
	    UNTIL done END REPEAT;
    CLOSE representantes;
    
    */
    
	
    SELECT *, TIME(timestamp),CONCAT(HOUR(timestamp),':', MINUTE(timestamp)) AS Hora  FROM mensajes
	WHERE men_id > LastId AND  eje_id = _IdEje
    ORDER BY rep_id, timestamp;
END$$

CREATE PROCEDURE `CHAT_GUARDA_MENSAJE_SP` (IN `_mensaje` VARCHAR(1000) CHARSET utf8, IN `_IdRep` INTEGER, IN `_IdEje` INTEGER, IN `_Tipo` INTEGER, IN `_Empresa` INTEGER)  BEGIN
	INSERT INTO mensajes(men_mensaje, rep_id, eje_id, men_tipo_usuario, emp_id) VALUES(_mensaje, _IdRep, _IdEje, _Tipo, _Empresa);
    SELECT 1 AS success, LAST_INSERT_ID() as LastID;
END$$

CREATE PROCEDURE `CLI_ACTUALIZAR_SP` (IN `idCliente` INT(20), IN `_razon` VARCHAR(250) CHARSET utf8, IN `_rfc` VARCHAR(50) CHARSET utf8)  BEGIN
	
    UPDATE cliente SET
						cli_rason_social = _razon,
                        cli_rfc = _rfc
	WHERE cli_id = idCliente;
    SELECT 1 AS 'success', 'Cliente actualizado correctamente' AS 'msg';
    
   
END$$

CREATE PROCEDURE `CLI_AGENTEPRINCIPAL_SP` (IN `idClej` INT)  BEGIN
	DECLARE idCliente INT;
    SET idCliente = (SELECT cli_id FROM clienteejecutivo WHERE clej_id = idClej);
    
    UPDATE clienteejecutivo SET clej_primario = 2 WHERE cli_id = idCliente;
    UPDATE clienteejecutivo SET clej_primario = 1 WHERE clej_id = idClej;
    
    SELECT 1 AS success, 'Se ha asignado un nuevo agente principal de forma correcta' AS msg;
END$$

CREATE PROCEDURE `CLI_ASIGNAAGENTE_SP` (IN `idCliente` INT, IN `idEjecutivo` INT)  BEGIN
	INSERT INTO clienteejecutivo(cli_id, eje_id, clej_estatus, clej_primario) values( idCliente, idEjecutivo, 1, 2 );
    SELECT 1 AS success, 'Se ha asignado un nuevo agente' AS msg;
END$$

CREATE PROCEDURE `CLI_ASIGNA_AREA_SP` (IN `idCliente` INT, IN `idArea` INT, IN `Estatus` INT)  BEGIN        
	DECLARE idClar INT;
    SET idClar = ( SELECT clar_id FROM clientearea WHERE cli_id = idCliente AND ca_id = idArea);
        
    IF( idClar IS NULL )THEN
		INSERT INTO clientearea(cli_id, ca_id, clar_estatus) VALUES( idCliente, idArea, Estatus);
		SELECT 'Área asignada.' as msg;
	ELSE
		UPDATE clientearea SET clar_estatus = Estatus WHERE clar_id = idClar;
        IF( Estatus = 1 )THEN
			SELECT 'Se ha asignado.' as msg;
        ELSE
			SELECT 'Se ha desvinculado.' as msg;
        END IF;
    END IF;
END$$

CREATE PROCEDURE `CLI_CONTROLACTIVIDAD_SP` (IN `idCliente` INT)  BEGIN
	DECLARE estatus INT;
    DECLARE msg VARCHAR(300);
    SET estatus = (SELECT cli_estatus FROM cliente WHERE cli_id = idCliente);
    
    IF( estatus = 0 )THEN
		SET estatus = 1;
        SET msg = 'El cliente se ha activado nuevamente';
    ELSE
		SET estatus = 0;
        SET msg = 'El cliente se ha desactivado';
    END IF;
    
	UPDATE cliente SET cli_estatus = estatus WHERE cli_id = idCliente;
	SELECT 1 as 'success', msg as 'msg';
END$$

CREATE PROCEDURE `CLI_GET_ONE_SP` (IN `_Key` VARCHAR(50) CHARSET utf8)  BEGIN  
	DECLARE idCliente INT(30);
    DECLARE idRelacion INT;
        
    SET idCliente = ( SELECT cli_id FROM cliente WHERE `key` = _Key );    
    SELECT * FROM cliente CLI WHERE `key` = _Key;
    -- SET idRelacion = ( SELECT clej_id FROM clienteejecutivo WHERE clej_estatus = 1 AND cli_id = idCliente );
    /*
    IF( idRelacion IS NULL )THEN
		SELECT * FROM cliente CLI WHERE `key` = _Key;
    ELSE
		SELECT CLI.*, eje_id  FROM cliente CLI
		LEFT JOIN clienteejecutivo CLEJ ON CLI.cli_id = CLEJ.cli_id
		WHERE `key` = _Key AND clej_estatus = 1 AND clej_primario = 1;
    END IF;*/
END$$

CREATE PROCEDURE `CLI_INSERTAR_NUEVO_SP` (IN `idEmpresa` INT(20), IN `_razon` VARCHAR(250) CHARSET utf8, IN `_rfc` VARCHAR(50) CHARSET utf8, IN `_email` VARCHAR(60) CHARSET utf8)  BEGIN
	DECLARE idRep INT(20);
    DECLARE _key VARCHAR(100);
    
    SET idRep = ( SELECT rep_id FROM representante WHERE rep_email = _email );
    SET _key  = MD5( CURRENT_TIMESTAMP );	
    
    IF( idRep IS NOT NULL )THEN
		SELECT 0 AS 'success', 'El email que proporciona ya esta registrado en la base de datos' AS 'msg';
    ELSE
		INSERT INTO cliente(cli_rason_social, cli_rfc, `key`, cli_estatus, emp_id) VALUES(_razon, _rfc, _key, 1, idEmpresa);
        SELECT 1 AS 'success', 'Se ha registrado correctamente un nuevo cliente' AS 'msg', LAST_INSERT_ID() as 'LastId', _key as 'key';
        
        -- INSERT INTO usuario(usu_usuario, usu_password, usu_estatus, cu_id, emp_id) values(_email, _pass, 1, 4, idEmpresa );
    END IF;
END$$

CREATE PROCEDURE `CLI_LOGIN_SP` (IN `user` VARCHAR(150) CHARSET utf8, IN `pass` VARCHAR(150) CHARSET utf8)  BEGIN
	SELECT * FROM usuario USU
	INNER JOIN representante REP ON usu_usuario = rep_email
	INNER JOIN clienteejecutivo CE ON REP.cli_id = CE.cli_id
	INNER JOIN ejecutivo EJE ON CE.eje_id = EJE.eje_id
	WHERE cu_id = 4
		  AND usu_usuario = user
		  AND usu_password = pass
		  AND CE.clej_estatus = 1
		  AND clej_primario = 1;
	/*SELECT * FROM usuario USU
	INNER JOIN cliente CLI ON usu_usuario = cli_email
	INNER JOIN clienteejecutivo CE ON CLI.cli_id = CE.cli_id
	INNER JOIN ejecutivo EJE ON CE.eje_id = EJE.eje_id
	WHERE cu_id = 4
		  AND usu_usuario = user
		  AND usu_password = pass
		  AND CE.clej_estatus = 1;*/
END$$

CREATE PROCEDURE `CLI_POR_EJECUTIVO_SP` (IN `idEje` INT(60))  BEGIN
	/*SELECT *
	FROM clienteejecutivo CE
	INNER JOIN cliente CLI ON CE.cli_id = CLI.cli_id
	WHERE `eje_id` = idEje AND clej_estatus != 0;*/
    SELECT *
	FROM representante REP
	INNER JOIN clienteejecutivo CE ON REP.cli_id = CE.cli_id
	INNER JOIN cliente CLI ON CE.cli_id = CLI.cli_id
	WHERE `eje_id` = idEje AND clej_estatus != 0;
END$$

CREATE PROCEDURE `CLI_POR_EJECUTIVO_SP_TEST` (IN `_Ideje` VARCHAR(255) CHARSET utf8, IN `_Tpro` VARCHAR(255) CHARSET utf8)  BEGIN
	SET @baseCliente = 'informacionspf';
	SET @Query = CONCAT('SELECT * FROM ',@baseCliente,'.clientes CLI 
							LEFT JOIN ',@baseCliente,'.treg ON CLI.Treg = treg.Idtr
                            LEFT JOIN ',@baseCliente,'.tpro ON CLI.Tpro = tpro.Idto
                            LEFT JOIN ',@baseCliente,'.ttip ON CLI.Ttip = ttip.Idtp
                            LEFT JOIN ',@baseCliente,'.ejecutivos EJE ON CLI.Ideje = EJE.Ideje
                            WHERE CLI.Ideje = ', _Ideje);
	
    IF( _Tpro <> 0 ) THEN
		SET @Query = CONCAT( @Query , ' AND Tpro = ', _Tpro );
    END IF;
    
	PREPARE smpt FROM @Query;
	EXECUTE smpt;
	DEALLOCATE PREPARE smpt;
END$$

CREATE PROCEDURE `CLI_POR_EMPRESA_AREAS_SP` (IN `idCliente` INT(30))  BEGIN
	SELECT  CA.*, 
			ARE.*
    FROM cliente CLI
	INNER JOIN clientearea CA       ON CLI.cli_id = CA.cli_id
	INNER JOIN catalogoarea ARE 	ON ARE.ca_id = CA.ca_id
	WHERE CA.cli_id = idCliente 
		  AND cli_estatus = 1;
END$$

CREATE PROCEDURE `CLI_POR_EMPRESA_SP` (IN `idEmpresa` INT(30))  BEGIN
	SELECT  *,
			(SELECT COUNT(clar_id) FROM clientearea
			 WHERE cli_id = CLI.cli_id AND clar_estatus = 1) AS Areas_Count,
			IFNULL( (SELECT eje_id FROM clienteejecutivo
			 WHERE cli_id = CLI.cli_id AND clej_estatus = 1 AND clej_primario = 1), 0) AS idEjecutivo,
			3 as noResponsable
	FROM cliente CLI
			WHERE emp_id = idEmpresa 
		  AND cli_estatus IN (0,1);
END$$

CREATE PROCEDURE `CLI_QUITARAGENTE_SP` (IN `idClej` INT)  BEGIN
	DELETE FROM clienteejecutivo WHERE clej_id= idClej;
    SELECT 1 AS success, 'Se ha eliminado de forma correcta' AS msg;
END$$

CREATE PROCEDURE `CLI_UPD_EDITAR_SP` (IN `idCliente` INT, IN `_razon` VARCHAR(500) CHARSET utf8, IN `_rfc` VARCHAR(20) CHARSET utf8)  BEGIN
	UPDATE Cliente SET cli_rfc = _rfc, cli_rason_social = _razon WHERE cli_id = idCliente;
    SELECT 1 AS 'success', 'Se ha actualizado correctamente la informacion del cliente' AS 'msg';
END$$

CREATE PROCEDURE `CLI_USOAREA_SP` (IN `idCliente` INT, IN `idArea` INT)  BEGIN
	SELECT COUNT(EJAR.ejar_id) total FROM ejecutivoarea EJAR
	INNER JOIN ejecutivo EJE ON EJAR.eje_id = EJE.eje_id
	INNER JOIN clienteejecutivo CLEJ ON CLEJ.eje_id = EJE.eje_id
	WHERE CLEJ.cli_id = idCliente AND EJAR.ejar_estatus = 1 AND EJAR.ca_id = idArea;
END$$

CREATE PROCEDURE `EJE_ACTUALIZAR_INFO_SP` (IN `idEjecutivo` INT(30), IN `eje_nombre` VARCHAR(250) CHARSET utf8, IN `eje_email` VARCHAR(250) CHARSET utf8, IN `eje_telefono` VARCHAR(150) CHARSET utf8, IN `eje_celular` VARCHAR(150) CHARSET utf8)  BEGIN
	UPDATE ejecutivo SET `eje_nombre` = eje_nombre, `eje_email` = eje_email, `eje_telefono` = eje_telefono, `eje_celular` = eje_celular WHERE eje_id = idEjecutivo;
    SELECT 1 'success';
END$$

CREATE PROCEDURE `EJE_AREA_EJECUTIVO_SP` (IN `aje_id` NUMERIC(30))  BEGIN    
	SELECT EJAR.*, CA.* FROM ejecutivoarea EJAR
	INNER JOIN ejecutivo EJE ON EJAR.eje_id = EJE.eje_id
	INNER JOIN catalogoarea CA ON EJAR.ca_id = CA.ca_id
	WHERE EJE.eje_id = aje_id;
END$$

CREATE PROCEDURE `EJE_ASIGNAR_AREA_SP` (IN `idEjecutivo` INT(30), IN `idArea` INT(30), IN `estatus` INT(1))  BEGIN
	DECLARE idRel INT(30);
    DECLARE estatus_actual INT(30);
    
    SET idRel = ( SELECT ejar_id FROM ejecutivoarea WHERE eje_id = idEjecutivo AND ca_id = idArea );    
	SET estatus_actual = ( SELECT ejar_estatus FROM ejecutivoarea WHERE eje_id = idEjecutivo AND ca_id = idArea );
    
    IF(idRel IS NULL)THEN
		IF( estatus = 1 ) THEN
			INSERT INTO ejecutivoarea(eje_id, ca_id, ejar_estatus) values( idEjecutivo, idArea, 1 );
			SELECT 'Se ha asignado el &aacute;rea al ejecutivo.' as msg, 'success' as label;
        ELSE
			SELECT 'Sin cambios.' as msg, 'default' as label;
        END IF;
    ELSE
		IF( estatus_actual = estatus ) THEN
			SELECT 'Sin cambios.' as msg, 'default' as label;
        ELSE
			UPDATE ejecutivoarea SET ejar_estatus = estatus WHERE ejar_id = idRel;
			IF( estatus = 2 ) THEN
				SELECT 'Se ha deshabilitado esta &aacute;rea.' as msg, 'warning' as label;
			ELSE
				SELECT 'Se ha vuelo a reasignar el &aacute;rea.' as msg, 'success' as label;
			END IF;
        END IF;
    END IF;
END$$

CREATE PROCEDURE `EJE_ASIGNAR_CLIENTE_SP` (IN `idEjecutivo` INT(30), IN `idCliente` INT(30), IN `estatus` INT(1))  BEGIN
	DECLARE idRel INT(30);
    DECLARE estatus_actual INT(30);
        
    SET idRel = ( SELECT clej_id FROM clienteejecutivo WHERE cli_id = idCliente AND eje_id = idEjecutivo );
	SET estatus_actual = ( SELECT clej_estatus FROM clienteejecutivo WHERE cli_id = idCliente AND eje_id = idEjecutivo );
        
    IF(idRel IS NULL)THEN
		IF( estatus = 1 ) THEN
			UPDATE clienteejecutivo SET clej_estatus = 2 WHERE cli_id = idCliente;
			INSERT INTO clienteejecutivo(cli_id, eje_id, clej_estatus) values( idCliente, idEjecutivo, 1 );
			SELECT 'Se ha asignado el cliente al ejecutivo.' as msg, 'success' as label;
        ELSE
			SELECT 'Sin cambios.' as msg, 'default' as label;
        END IF;
    ELSE
		IF( estatus_actual = estatus ) THEN
			SELECT 'Sin cambios.' as msg, 'default' as label;
        ELSE
			DELETE FROM clienteejecutivo WHERE cli_id = idCliente;
            SELECT 'Cliente desvinculado' as msg, 'warning' as label;
            /*
			UPDATE clienteejecutivo SET clej_estatus = 2 WHERE cli_id = idCliente;
			UPDATE clienteejecutivo SET clej_estatus = estatus WHERE clej_id = idRel;
			IF( estatus = 2 ) THEN
				SELECT 'Cliente desvinculado' as msg, 'warning' as label;
			ELSE
				SELECT 'Cliente Asignado' as msg, 'success' as label;
			END IF;
            */
        END IF;
    END IF;
END$$

CREATE PROCEDURE `EJE_BY_AREAS_AND_CUSTOMER_SP` (IN `idArea` VARCHAR(250) CHARSET utf8, IN `idEmpresa` INT, IN `idEjecutivo` INT)  BEGIN
	SET @Query = CONCAT('SELECT DISTINCT( eje_nombre ) Nombre, EJE.eje_id, 
						 CASE EJE.eje_id WHEN ',idEjecutivo,' THEN 1 ELSE 0 END as Selected
						 FROM ejecutivoarea ARE
						 INNER JOIN ejecutivo EJE ON ARE.eje_id = EJE.eje_id
						 WHERE ejar_estatus = 1 AND EJE.emp_id = ', idEmpresa ,' AND ca_id IN (', idArea,');');
	    
	PREPARE smpt FROM @Query;
	EXECUTE smpt;
	DEALLOCATE PREPARE smpt;
END$$

CREATE PROCEDURE `EJE_BY_AREAS_SP` (IN `idArea` VARCHAR(250) CHARSET utf8, IN `idEmpresa` INT)  BEGIN        
	SET @Query = CONCAT('SELECT DISTINCT( eje_nombre ) Nombre, EJE.eje_id FROM ejecutivoarea ARE
						 INNER JOIN ejecutivo EJE ON ARE.eje_id = EJE.eje_id
						 WHERE ejar_estatus = 1 AND EJE.emp_id = ', idEmpresa ,' AND ca_id IN (', idArea,');');
	    
	PREPARE smpt FROM @Query;
	EXECUTE smpt;
	DEALLOCATE PREPARE smpt;
    
END$$

CREATE PROCEDURE `EJE_CAMBIO_ESTATUS_SP` (IN `idEje` INT(30), IN `idEstatus` INT(1))  BEGIN
	DECLARE idHistorico INT(30);
    SET idHistorico = ( SELECT hee_id FROM historialestatusejecutivo WHERE eje_id = idEje ORDER BY hee_id DESC LIMIT 1 );
    
    IF( idHistorico IS NOT NULL ) THEN
		UPDATE historialestatusejecutivo SET hee_fecha_fin = NOW() WHERE hee_id = idHistorico;
    END IF;
    
    UPDATE ejecutivo SET ese_id = idEstatus WHERE eje_id = idEje;
    INSERT INTO historialestatusejecutivo( eje_id, ese_id, hee_fecha_inicio ) VALUES( idEje, idEstatus, NOW() );
    
    SELECT 1 'success';
END$$

CREATE PROCEDURE `EJE_GET_ALL_SP` (IN `emp_id` NUMERIC(30), IN `eje_id` NUMERIC(30))  BEGIN    
	SET @Query = CONCAT('SELECT *,
				  (SELECT COUNT(clej_id) Total FROM clienteejecutivo CLEJ 
					INNER JOIN cliente CLI ON CLI.cli_id = CLEJ.cli_id
					INNER JOIN ejecutivo EJE ON EJE.eje_id = CLEJ.eje_id
					WHERE EJE.eje_id = EJEC.eje_id AND clej_estatus = 1 AND cli_estatus = 1) Clientes_Asignados,
				  (SELECT COUNT(ejar_id) Total FROM ejecutivoarea EJAR
					INNER JOIN ejecutivo EJE ON EJAR.eje_id = EJE.eje_id
					INNER JOIN catalogoarea CA ON EJAR.ca_id = CA.ca_id
					WHERE EJE.eje_id = EJEC.eje_id AND ejar_estatus = 1) Areas_Asignadas
				  FROM ejecutivo EJEC 
				  WHERE emp_id = ', emp_id);
	
    IF( eje_id <> 0 ) THEN
		SET @Query = CONCAT( @Query , ' AND eje_id = ', eje_id );
    END IF;
        
	PREPARE smpt FROM @Query;
	EXECUTE smpt;
	DEALLOCATE PREPARE smpt;
END$$

CREATE PROCEDURE `EJE_GET_BY_CLIENTE_SP` (IN `idCliente` VARCHAR(60) CHARSET utf8)  BEGIN    
	SELECT *,
	  (SELECT COUNT(clej_id) Total FROM clienteejecutivo CLEJ 
		INNER JOIN cliente CLI ON CLI.cli_id = CLEJ.cli_id
		INNER JOIN ejecutivo EJE ON EJE.eje_id = CLEJ.eje_id
		WHERE EJE.eje_id = EJEC.eje_id AND clej_estatus = 1) Clientes_Asignados,
	  (SELECT COUNT(ejar_id) Total FROM ejecutivoarea EJAR
		INNER JOIN ejecutivo EJE ON EJAR.eje_id = EJE.eje_id
		INNER JOIN catalogoarea CA ON EJAR.ca_id = CA.ca_id
		WHERE EJE.eje_id = EJEC.eje_id AND ejar_estatus = 1) Areas_Asignadas
	FROM ejecutivo EJEC
    INNER JOIN clienteejecutivo CLEJ ON EJEC.eje_id = CLEJ.eje_id
	WHERE CLEJ.cli_id = idCliente AND CLEJ.clej_estatus != 0;
END$$

CREATE PROCEDURE `EJE_GET_BY_ID_SP` (IN `idEje` VARCHAR(60) CHARSET utf8)  BEGIN    
	SELECT *,
	  (SELECT COUNT(clej_id) Total FROM clienteejecutivo CLEJ 
		INNER JOIN cliente CLI ON CLI.cli_id = CLEJ.cli_id
		INNER JOIN ejecutivo EJE ON EJE.eje_id = CLEJ.eje_id
		WHERE EJE.eje_id = EJEC.eje_id AND clej_estatus = 1) Clientes_Asignados,
	  (SELECT COUNT(ejar_id) Total FROM ejecutivoarea EJAR
		INNER JOIN ejecutivo EJE ON EJAR.eje_id = EJE.eje_id
		INNER JOIN catalogoarea CA ON EJAR.ca_id = CA.ca_id
		WHERE EJE.eje_id = EJEC.eje_id AND ejar_estatus = 1) Areas_Asignadas
	FROM ejecutivo EJEC
	WHERE eje_id = idEje; 
END$$

CREATE PROCEDURE `EJE_GET_BY_KEY_SP` (IN `clave` VARCHAR(60) CHARSET utf8)  BEGIN    
	SELECT *,
	  (SELECT COUNT(clej_id) Total FROM clienteejecutivo CLEJ 
		INNER JOIN cliente CLI ON CLI.cli_id = CLEJ.cli_id
		INNER JOIN ejecutivo EJE ON EJE.eje_id = CLEJ.eje_id
		WHERE EJE.eje_id = EJEC.eje_id AND clej_estatus = 1) Clientes_Asignados,
	  (SELECT COUNT(ejar_id) Total FROM ejecutivoarea EJAR
		INNER JOIN ejecutivo EJE ON EJAR.eje_id = EJE.eje_id
		INNER JOIN catalogoarea CA ON EJAR.ca_id = CA.ca_id
		WHERE EJE.eje_id = EJEC.eje_id AND ejar_estatus = 1) Areas_Asignadas
	FROM ejecutivo EJEC
	WHERE `key` = clave; 
END$$

CREATE PROCEDURE `EJE_INSERTAR_NUEVO_SP` (IN `_nombre` VARCHAR(250) CHARSET utf8, IN `_telefono` VARCHAR(50) CHARSET utf8, IN `_celular` VARCHAR(50) CHARSET utf8, IN `_email` VARCHAR(50) CHARSET utf8, IN `_idEmp` VARCHAR(50) CHARSET utf8, IN `_key` VARCHAR(50) CHARSET utf8)  BEGIN
	DECLARE idEje INT(20);
    DECLARE _pass VARCHAR(20);
    
    SET idEje  = ( SELECT eje_id FROM ejecutivo WHERE eje_email = _email );
        SET _pass  = 'qwerty';
    
    IF( idEje IS NOT NULL )THEN
		SELECT 0 AS 'success', 'El email que proporciona ya esta registrado en la base de datos' AS 'msg';
    ELSE
		INSERT INTO ejecutivo(eje_nombre, eje_telefono, eje_celular, eje_email, ese_id, emp_id, `key`) VALUES(_nombre, _telefono, _celular, _email, 1, _idEmp, _key);
        SELECT 1 AS 'success', 'Se ha registrado correctamente un nuevo ejecutivo' AS 'msg', LAST_INSERT_ID() as 'LastId', _key as 'key', _pass as 'pass';
        
        INSERT INTO usuario(usu_usuario, usu_password, usu_estatus, cu_id, emp_id) values(_email, _pass, 1, 3, _idEmp );
    END IF;
    
END$$

CREATE PROCEDURE `EJE_LOGIN_SP` (IN `user` VARCHAR(150) CHARSET utf8, IN `pass` VARCHAR(150) CHARSET utf8)  BEGIN
    SELECT * FROM usuario USU
	INNER JOIN ejecutivo EJE ON usu_usuario = eje_email
	WHERE cu_id = 3
		  AND usu_usuario = user
		  AND usu_password = pass;
END$$

CREATE PROCEDURE `REP_ACTUALIZAR_SP` (IN `idRepresentante` INT, IN `rNombre` VARCHAR(250) CHARSET utf8, IN `rTelefono` VARCHAR(30) CHARSET utf8)  BEGIN
	UPDATE representante SET rep_nombre = rNombre, rep_telefono = rTelefono WHERE rep_id = idRepresentante;
    SELECT 1 as 'success', 'Se ha actualizado de forma correcta' as 'msg';
END$$

CREATE PROCEDURE `RESTORE_DATA` ()  BEGIN
	TRUNCATE `cliente`;
    Select 'Restaurando tabla cliente' as  'msg';
    
	TRUNCATE `clientearea`;
    Select 'Restaurando tabla clientearea' as  'msg';
    
	TRUNCATE `clienteejecutivo`;
    Select 'Restaurando tabla clienteejecutivo' as  'msg';
    
	TRUNCATE `ejecutivo`;
    Select 'Restaurando tabla ejecutivo' as  'msg';
    
	TRUNCATE `ejecutivoarea`;
    Select 'Restaurando tabla ejecutivoarea' as  'msg';
    
	TRUNCATE `mensajes`;
    Select 'Restaurando tabla mensajes' as  'msg';
    
	TRUNCATE `representante`;
    Select 'Restaurando tabla representante' as  'msg';
    
    DELETE FROM usuario WHERE usu_id > 2;
    Select 'Restaurando tabla usuarios' as  'msg';
END$$

CREATE PROCEDURE `RES_DELETE_SP` (IN `idRep` INT)  BEGIN
	UPDATE representante SET rep_estatus = 0 WHERE rep_id = idRep;
    SELECT 1 as 'success', 'Se ha eliminado de forma correcta' as 'msg';
END$$

CREATE PROCEDURE `RES_GET_BY_CLIENTE_SP` (IN `idCliente` INT)  BEGIN
	SELECT REP.*, CTC.* FROM representante REP
	INNER JOIN cliente CLI ON REP.cli_id = CLI.cli_id
	INNER JOIN catalogotipocliente CTC ON CTC.ctc_id = REP.ctc_id
	WHERE CLI.cli_id = idCliente AND REP.rep_estatus != 0;
END$$

CREATE PROCEDURE `RES_INSERTAR_NUEVO_SP` (IN `idCliente` INT(20), IN `_nombre` VARCHAR(250) CHARSET utf8, IN `_email` VARCHAR(250) CHARSET utf8, IN `_telefono` VARCHAR(250) CHARSET utf8, IN `idEmpresa` INT(20), IN `idCtc` INT(20))  BEGIN
	DECLARE idRep INT(20);
	DECLARE _pass VARCHAR(20);
    DECLARE _key VARCHAR(100);
    
    SET idRep = ( SELECT rep_id FROM representante WHERE rep_email = _email );
    SET _pass = 'qwerty';
    SET _key  = MD5( CURRENT_TIMESTAMP );
    
    IF( idRep IS NOT NULL )THEN
		SELECT 0 AS 'success', 'El email que proporciona ya esta registrado en la base de datos' AS 'msg';
    ELSE
		INSERT INTO representante(`rep_nombre`, `rep_email`, `rep_telefono`, `rep_estatus`, `ctc_id`, `key`, `emp_id`, `cli_id`) VALUES( _nombre, _email, _telefono, 1, idCtc, _key, idEmpresa, idCliente );
		INSERT INTO usuario(usu_usuario, usu_password, usu_estatus, cu_id, emp_id) values(_email, _pass, 1, 4, idEmpresa );
    
		SELECT 1 AS 'success', 'Se ha registrado correctamente un nuevo cliente' AS 'msg', _pass as 'pass';
	END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalogoarea`
--

CREATE TABLE `catalogoarea` (
  `ca_id` int(11) NOT NULL,
  `ca_nombre` varchar(60) COLLATE latin1_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `catalogoarea`
--

INSERT INTO `catalogoarea` (`ca_id`, `ca_nombre`) VALUES
(1, 'Juridico'),
(2, 'Fiscal'),
(3, 'Contable'),
(4, 'Soporte Tecnico'),
(5, 'Soporte Asesorias');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalogotipocliente`
--

CREATE TABLE `catalogotipocliente` (
  `ctc_id` int(11) NOT NULL,
  `ctc_nombre` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `catalogotipocliente`
--

INSERT INTO `catalogotipocliente` (`ctc_id`, `ctc_nombre`) VALUES
(1, 'Directivo'),
(2, 'Representante');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalogousuario`
--

CREATE TABLE `catalogousuario` (
  `cu_id` int(11) NOT NULL,
  `cu_rol` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Tipos de usuario de momento encontramos\nSuperAdministrador\nAdministrador\nAgente\nCliente';

--
-- Volcado de datos para la tabla `catalogousuario`
--

INSERT INTO `catalogousuario` (`cu_id`, `cu_rol`) VALUES
(1, 'Super Administrador'),
(2, 'Administrador'),
(3, 'Ejecutivo'),
(4, 'Cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `cli_id` int(11) NOT NULL,
  `cli_rfc` varchar(18) COLLATE latin1_spanish_ci DEFAULT NULL,
  `cli_rason_social` varchar(255) COLLATE latin1_spanish_ci DEFAULT NULL,
  `cli_estatus` int(11) DEFAULT NULL,
  `emp_id` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `key` varchar(60) COLLATE latin1_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`cli_id`, `cli_rfc`, `cli_rason_social`, `cli_estatus`, `emp_id`, `timestamp`, `key`) VALUES
(1, 'GRI8704216N5', 'GRIANT S.A. DE C.V.', 1, 1, '2017-10-24 17:02:45', '71aa1b8bfc17343e747876606d820ae8'),
(2, 'GOSQ1398212', 'GOSSIP', 1, 1, '2017-10-24 19:42:33', 'ba789c1ea67bc30e2c35f78cda8694e4'),
(3, 'PROT871234', 'PROTAGON', 1, 1, '2017-10-24 19:44:41', '4ef5edec684ec441bb81cd4af48e9076');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientearea`
--

CREATE TABLE `clientearea` (
  `clar_id` int(11) NOT NULL,
  `cli_id` int(11) DEFAULT NULL,
  `ca_id` int(11) DEFAULT NULL,
  `clar_estatus` int(11) DEFAULT '1',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `clientearea`
--

INSERT INTO `clientearea` (`clar_id`, `cli_id`, `ca_id`, `clar_estatus`, `timestamp`) VALUES
(1, 1, 3, 1, '2017-10-24 17:02:46'),
(2, 1, 2, 1, '2017-10-24 17:02:46'),
(3, 1, 1, 1, '2017-10-24 17:02:46'),
(4, 2, 3, 1, '2017-10-24 19:42:34'),
(5, 2, 2, 1, '2017-10-24 19:42:34'),
(6, 2, 1, 2, '2017-10-24 19:42:34'),
(7, 3, 2, 1, '2017-10-24 19:44:42'),
(8, 3, 1, 1, '2017-10-24 19:44:42'),
(9, 3, 3, 1, '2017-10-24 19:44:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clienteejecutivo`
--

CREATE TABLE `clienteejecutivo` (
  `clej_id` int(11) NOT NULL,
  `cli_id` int(11) DEFAULT NULL,
  `eje_id` int(11) DEFAULT NULL,
  `clej_estatus` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `clej_primario` int(11) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `clienteejecutivo`
--

INSERT INTO `clienteejecutivo` (`clej_id`, `cli_id`, `eje_id`, `clej_estatus`, `timestamp`, `clej_primario`) VALUES
(6, 2, 2, 1, '2017-10-25 23:17:35', 1),
(33, 2, 1, 1, '2017-11-07 06:56:52', 2),
(34, 3, 2, 1, '2017-11-07 06:57:32', 1),
(39, 1, 2, 1, '2017-11-07 22:27:45', 2),
(40, 1, 1, 1, '2017-11-07 22:28:45', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracionempresa`
--

CREATE TABLE `configuracionempresa` (
  `conf_id` int(11) NOT NULL,
  `emp_id` int(11) DEFAULT NULL,
  `conf_integracion` int(11) DEFAULT '1',
  `conf_api` text COLLATE latin1_spanish_ci,
  `conf_caduca` int(11) DEFAULT '1',
  `conf_fecha_caduca` date DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `configuracionempresa`
--

INSERT INTO `configuracionempresa` (`conf_id`, `emp_id`, `conf_integracion`, `conf_api`, `conf_caduca`, `conf_fecha_caduca`, `timestamp`) VALUES
(1, 1, 1, 'http://localhost/api/', 0, NULL, '2017-06-15 01:28:58'),
(2, 2, 1, 'http://localhost/api/', 0, NULL, '2017-07-06 15:57:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ejecutivo`
--

CREATE TABLE `ejecutivo` (
  `eje_id` int(11) NOT NULL,
  `eje_nombre` varchar(150) COLLATE latin1_spanish_ci DEFAULT NULL,
  `eje_telefono` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL,
  `eje_celular` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL,
  `eje_email` varchar(150) COLLATE latin1_spanish_ci DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ese_id` int(11) DEFAULT '1',
  `emp_id` int(11) DEFAULT NULL,
  `key` varchar(100) COLLATE latin1_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `ejecutivo`
--

INSERT INTO `ejecutivo` (`eje_id`, `eje_nombre`, `eje_telefono`, `eje_celular`, `eje_email`, `timestamp`, `ese_id`, `emp_id`, `key`) VALUES
(1, 'Leonardo de Jesus Oronzor', '51432627716', '8187687126', 'leonardo@loladisenio.com.mx', '2017-10-24 16:34:13', 3, 1, '3db9936748d079d68d7e7f8b78d8be5c'),
(2, 'Norma Lilia Sanchez Ferrer', '123123123', '123123123123', 'normita@griant.mx', '2017-10-24 19:46:31', 1, 1, '3d158adce7de132bb3e0e845e95872bd');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ejecutivoarea`
--

CREATE TABLE `ejecutivoarea` (
  `ejar_id` int(11) NOT NULL,
  `eje_id` int(11) DEFAULT NULL,
  `ca_id` int(11) DEFAULT NULL,
  `ejar_estatus` int(11) DEFAULT '1',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `ejecutivoarea`
--

INSERT INTO `ejecutivoarea` (`ejar_id`, `eje_id`, `ca_id`, `ejar_estatus`, `timestamp`) VALUES
(1, 1, 1, 2, '2017-10-24 16:34:26'),
(2, 1, 2, 2, '2017-10-24 16:34:26'),
(3, 1, 3, 1, '2017-10-24 16:34:26'),
(4, 2, 3, 2, '2017-10-24 19:46:40'),
(5, 2, 2, 1, '2017-10-24 19:46:52'),
(6, 2, 1, 1, '2017-10-24 19:46:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa`
--

CREATE TABLE `empresa` (
  `emp_id` int(11) NOT NULL,
  `emp_rason_social` varchar(255) COLLATE latin1_spanish_ci DEFAULT NULL,
  `emp_rfc` varchar(15) COLLATE latin1_spanish_ci DEFAULT NULL,
  `emp_contacto_nombre` varchar(150) COLLATE latin1_spanish_ci DEFAULT NULL,
  `emp_contacto_email` varchar(150) COLLATE latin1_spanish_ci DEFAULT NULL,
  `emp_contacto_telefono` varchar(50) COLLATE latin1_spanish_ci DEFAULT NULL,
  `emp_contacto_direccion` varchar(255) COLLATE latin1_spanish_ci DEFAULT NULL,
  `emp_estatus` int(11) DEFAULT '1',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `empresa`
--

INSERT INTO `empresa` (`emp_id`, `emp_rason_social`, `emp_rfc`, `emp_contacto_nombre`, `emp_contacto_email`, `emp_contacto_telefono`, `emp_contacto_direccion`, `emp_estatus`, `timestamp`) VALUES
(1, 'PLANETA FISCAL', 'PFISCAL0001', 'ESTEBAN MORENO VARGAS', 'esteban@loladisenio.com.mx', '555555555', 'sin direccion', 1, '2017-06-14 23:36:20'),
(2, 'GRIANT SA DE CV', 'GIIA8704216N5', 'ALEJANDRO GRIJALVA ANTONIO', 'alex9abril@gmail.com', '555555555', 'sin direccion', 1, '2017-07-06 15:54:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresaarea`
--

CREATE TABLE `empresaarea` (
  `empar_id` int(11) NOT NULL,
  `emp_id` int(11) DEFAULT NULL,
  `ca_id` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `empar_estatus` int(11) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `empresaarea`
--

INSERT INTO `empresaarea` (`empar_id`, `emp_id`, `ca_id`, `timestamp`, `empar_estatus`) VALUES
(1, 1, 1, '2017-06-15 01:43:26', 1),
(2, 1, 2, '2017-06-15 01:43:26', 1),
(3, 1, 3, '2017-06-15 01:43:26', 1),
(4, 2, 4, '2017-07-06 15:59:18', 1),
(5, 2, 5, '2017-07-06 15:59:18', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estatuscliente`
--

CREATE TABLE `estatuscliente` (
  `esc_id` int(11) NOT NULL,
  `esc_estatus` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `estatuscliente`
--

INSERT INTO `estatuscliente` (`esc_id`, `esc_estatus`) VALUES
(1, 'Nuevo sin configurar'),
(2, 'Activo'),
(3, 'Standby'),
(4, 'Eliminado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estatusejecutivo`
--

CREATE TABLE `estatusejecutivo` (
  `ese_id` int(11) NOT NULL,
  `ese_estatus` varchar(50) COLLATE latin1_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `estatusejecutivo`
--

INSERT INTO `estatusejecutivo` (`ese_id`, `ese_estatus`) VALUES
(1, 'Nuevo'),
(2, 'Deshabilitado'),
(3, 'Por Iniciar'),
(4, 'Conectado'),
(5, 'Desconectado'),
(6, 'Ocupado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historialestatusejecutivo`
--

CREATE TABLE `historialestatusejecutivo` (
  `hee_id` int(11) NOT NULL,
  `eje_id` int(11) DEFAULT NULL,
  `ese_id` int(11) DEFAULT NULL,
  `hee_fecha_inicio` datetime DEFAULT NULL,
  `hee_fecha_fin` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `historialestatusejecutivo`
--

INSERT INTO `historialestatusejecutivo` (`hee_id`, `eje_id`, `ese_id`, `hee_fecha_inicio`, `hee_fecha_fin`) VALUES
(1, 1, 2, '2017-10-25 17:25:26', '2017-10-25 17:25:38'),
(2, 1, 3, '2017-10-25 17:25:38', '2017-11-03 12:56:44'),
(3, 1, 2, '2017-11-03 12:56:44', '2017-11-03 12:56:59'),
(4, 1, 3, '2017-11-03 12:56:59', '2017-11-03 13:12:24'),
(5, 1, 2, '2017-11-03 13:12:24', '2017-11-03 13:12:30'),
(6, 1, 3, '2017-11-03 13:12:30', '2017-11-03 13:33:22'),
(7, 1, 2, '2017-11-03 13:33:22', '2017-11-03 13:36:01'),
(8, 1, 3, '2017-11-03 13:36:01', '2017-11-06 10:34:21'),
(9, 1, 2, '2017-11-06 10:34:21', '2017-11-06 10:34:39'),
(10, 1, 3, '2017-11-06 10:34:39', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes`
--

CREATE TABLE `mensajes` (
  `men_id` int(11) NOT NULL,
  `men_mensaje` varchar(1000) COLLATE latin1_spanish_ci DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rep_id` int(11) DEFAULT NULL,
  `eje_id` int(11) DEFAULT NULL,
  `men_tipo_usuario` int(11) DEFAULT NULL,
  `emp_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `mensajes`
--

INSERT INTO `mensajes` (`men_id`, `men_mensaje`, `timestamp`, `rep_id`, `eje_id`, `men_tipo_usuario`, `emp_id`) VALUES
(1, 'Hola que tal?', '2017-11-06 00:20:26', 1, 1, 1, 1),
(2, 'como estas', '2017-11-07 00:20:28', 1, 1, 1, 1),
(3, 'te estoy esperando a que te apures', '2017-11-08 00:20:38', 1, 1, 1, 1),
(4, 'klajs dhalskdj aslkjd', '2017-11-09 00:41:36', 1, 1, 1, 1),
(5, 'laksjd laskjd alskjd las', '2017-11-09 00:41:37', 1, 1, 1, 1),
(6, 'laksjd alskjd asljkd', '2017-11-09 00:41:39', 1, 1, 1, 1),
(7, 'laksd laskjd laskjd as', '2017-11-09 00:41:41', 1, 1, 1, 1),
(8, 'lkasjdh laskjd laskjd als', '2017-11-09 00:41:43', 1, 1, 1, 1),
(9, 'l,kjasd laskjd laskdj alskjdas', '2017-11-09 00:41:53', 1, 1, 1, 1),
(10, 'webos', '2017-11-09 00:42:23', 2, 1, 1, 1),
(11, 'jejeje', '2017-11-09 00:42:26', 2, 1, 1, 1),
(12, 'ðŸ›', '2017-11-09 00:42:39', 2, 1, 1, 1),
(13, 'ðŸ›', '2017-11-09 00:42:40', 2, 1, 1, 1),
(14, 'ðŸ›', '2017-11-09 00:42:41', 2, 1, 1, 1),
(15, 'ðŸ‘', '2017-11-09 00:42:53', 2, 1, 1, 1),
(16, 'ðŸ‘', '2017-11-09 00:42:54', 2, 1, 1, 1),
(17, 'ðŸ‘', '2017-11-09 00:42:55', 2, 1, 1, 1),
(18, 'ij lkasj dlkajs dlaks djas', '2017-11-09 04:49:33', 1, 1, 1, 1),
(19, 'd', '2017-11-09 04:49:33', 1, 1, 1, 1),
(20, 'l kasjd laksjd alksjd laksjd lkasjd klasd', '2017-11-09 04:49:35', 1, 1, 1, 1),
(21, 'lakjsd lkasj dlkasjd laksjd laksjdf laksd', '2017-11-09 04:49:37', 1, 1, 1, 1),
(22, 'l aksjd laksjd alskdj alskjd alskdj aslkjd akls', '2017-11-09 04:49:39', 1, 1, 1, 1),
(23, 'alskdj alskdj alskdj alskdj alskdj alksd', '2017-11-09 04:49:42', 1, 1, 1, 1),
(24, 'lkasjd laksj dlaksjd laksj dlkajs d', '2017-11-09 04:49:44', 1, 1, 1, 1),
(25, '&ntilde;laksjd alskjd alskjd laksj dlaksjd', '2017-11-09 04:49:45', 1, 1, 1, 1),
(26, 'lkasdj alskdj laksjd alskjd lkasdj', '2017-11-09 04:49:48', 1, 1, 1, 1),
(27, 'l kasdj alskjd laksjd laskjd laksjd alks', '2017-11-09 04:49:50', 1, 1, 1, 1),
(28, 'lkasjd lkasj dlkasjd lkasjd lkasjd laksjd asjkd', '2017-11-09 04:49:52', 1, 1, 1, 1),
(29, 'laksdj alskdj alskdj alskjd laksjd lkasd', '2017-11-09 04:49:55', 1, 1, 1, 1),
(30, 'lkasdjfh jkadsfhalskdjaslkfdj alsdkja lskdj', '2017-11-09 04:49:57', 1, 1, 1, 1),
(31, 'lk asj dalksjd ldajks djalskdjaslkdj asldkjasldkjasldkjas', '2017-11-09 04:50:01', 1, 1, 1, 1),
(32, 'l kajs dlkasjd lakjsdflhkdja&ntilde;skljd alsk&ntilde;fjd aslkd jaskld', '2017-11-09 04:50:03', 1, 1, 1, 1),
(33, 'l kasj dalskjhdfasl&ntilde;kdjaslkfjalskdjalskd jaslkd', '2017-11-09 04:50:06', 1, 1, 1, 1),
(34, 'lkj lksdj alskdj laskdj laksjd as', '2017-11-09 04:50:09', 1, 1, 1, 1),
(35, 'dalksdj alksjd a&ntilde;slkd jlaskdj laksdj alskd', '2017-11-09 04:50:12', 1, 1, 1, 1),
(36, 'lk asjf alskjd laskjd 230je23jwe2', '2017-11-09 04:50:14', 1, 1, 1, 1),
(37, '0 92u3e023j098j2', '2017-11-09 04:50:16', 1, 1, 1, 1),
(38, 'e2d 09u2e 09ue2 09je2d 09j0 9j2e', '2017-11-09 04:50:18', 1, 1, 1, 1),
(39, '0 92ed0e2du90e2d 09ue2du90  09ue', '2017-11-09 04:50:20', 1, 1, 1, 1),
(40, '2e 09ude2 09ud2e 09iue0dd209u90 ud 09ud', '2017-11-09 04:50:22', 1, 1, 1, 1),
(41, '&#039; 09dfu20e92ed9020u39eu2039e', '2017-11-09 04:50:24', 1, 1, 1, 1),
(42, '&#039; 0 9u0ed2u02 092u3', '2017-11-09 04:50:26', 1, 1, 1, 1),
(43, '0ed2ed023 ed0293u 0ed', '2017-11-09 04:50:28', 1, 1, 1, 1),
(44, 'lkakjs dlqskj dalskjd laskdj alskjd laksdj laskj lkasjdlkasj dlkasj dlasj dlkasjd laskj laskdj alskdj alskdj alskjd alskjd laskjd laksj dlkasj dlkajs djlas', '2017-11-09 04:50:59', 1, 1, 1, 1),
(45, 'li dsajlaisjd alskdj alskd jlaskjd laksj dlkasjd laksj dlaksj dalskjd laksjd laksj dlkasj dlkasj dlkasjd laksjd lkasj dlkasjd lkasj dkasjd laskjd laksjd alskjd alskjd alskjd laksjd laksjd laksjd lkajsd lkajs dlkasjd lkasj dlkasj dlkasj dlkjas ldkjas lkdj aslkj dlaskj dlkajs dlkj ldkasj ldkajs dlkajs lkja sldkja slkdj aslkdj alskdj asl djlaskd', '2017-11-09 04:51:20', 1, 1, 1, 1),
(46, 'li dsajlaisjd alskdj alskd jlaskjd laksj dlkasjd laksj dlaksj dalskjd laksjd laksj dlkasj dlkasj dlkasjd laksjd lkasj dlkasjd lkasj dkasjd laskjd laksjd alskjd alskjd alskjd laksjd laksjd laksjd lkajsd lkajs dlkasjd lkasj dlkasj dlkasj dlkjas ldkjas lkdj aslkj dlaskj dlkajs dlkj ldkasj ldkajs dlkajs lkja sldkja slkdj aslkdj alskdj asl djlaskd', '2017-11-09 05:42:04', 1, 1, 1, 1),
(47, 'olids hfloisjd fslkdf', '2017-11-09 05:49:29', 1, 1, 1, 1),
(48, 'li dsajlaisjd alskdj alskd jlaskjd laksj dlkasjd laksj dlaksj dalskjd laksjd laksj dlkasj dlkasj dlkasjd laksjd lkasj dlkasjd lkasj dkasjd laskjd laksjd alskjd alskjd alskjd laksjd laksjd laksjd lkajsd lkajs dlkasjd lkasj dlkasj dlkasj dlkjas ldkjas lkdj aslkj dlaskj dlkajs dlkj ldkasj ldkajs dlkajs lkja sldkja slkdj aslkdj alskdj asl djlaskd\nli dsajlaisjd alskdj alskd jlaskjd laksj dlkasjd laksj dlaksj dalskjd laksjd laksj dlkasj dlkasj dlkasjd laksjd lkasj dlkasjd lkasj dkasjd laskjd laksjd alskjd alskjd alskjd laksjd laksjd laksjd lkajsd lkajs dlkasjd lkasj dlkasj dlkasj dlkjas ldkjas lkdj aslkj dlaskj dlkajs dlkj ldkasj ldkajs dlkajs lkja sldkja slkdj aslkdj alskdj asl djlaskd', '2017-11-09 05:53:24', 1, 1, 1, 1),
(49, 'ljkasdl kajs daljs dlkjasd', '2017-11-09 06:16:37', 1, 1, 1, 1),
(50, 'lkasj dlkasjd laksj dlkajs dlkas jdas', '2017-11-09 06:16:39', 1, 1, 1, 1),
(51, 'lkasj dlkasj d', '2017-11-09 06:16:39', 1, 1, 1, 1),
(52, 'aslk dj as ldjla skdj', '2017-11-09 06:16:41', 1, 1, 1, 1),
(53, 'aslk djal sdjals dj laksd', '2017-11-09 06:16:42', 1, 1, 1, 1),
(54, 'a slkdja sldkjasl kdj alskdj alksd', '2017-11-09 06:16:43', 1, 1, 1, 1),
(55, 'al ksdj alskjd las', '2017-11-09 06:16:44', 1, 1, 1, 1),
(56, 'alksdj alskd', '2017-11-09 06:16:45', 1, 1, 1, 1),
(57, 'a lskdj', '2017-11-09 06:16:46', 1, 1, 1, 1),
(58, 'asd lkhasd', '2017-11-09 06:16:46', 1, 1, 1, 1),
(59, 'dsdrcseadrcasrd', '2017-11-09 06:16:48', 1, 1, 1, 1),
(60, 'casf', '2017-11-09 06:16:49', 1, 1, 1, 1),
(61, 'acsrr', '2017-11-09 06:16:49', 1, 1, 1, 1),
(62, 'dcasrcqwvrc', '2017-11-09 06:16:50', 1, 1, 1, 1),
(63, 'cwarxdaskjads', '2017-11-09 06:16:51', 1, 1, 1, 1),
(64, 'xak jakdjacds', '2017-11-09 06:16:52', 1, 1, 1, 1),
(65, 'xah pskjd alksjd xlqs', '2017-11-09 06:16:53', 1, 1, 1, 1),
(66, 'dl asdkjd laskjd clkajsfd', '2017-11-09 06:16:55', 1, 1, 1, 1),
(67, '&ntilde;axlksjdf a&ntilde;sdlkj &ntilde;asld &ntilde;lakjsd as', '2017-11-09 06:16:56', 1, 1, 1, 1),
(68, '&ntilde;kjsa xd&ntilde;xajs &ntilde;dla s&ntilde;dkkja s&ntilde;fa&ntilde;s j', '2017-11-09 06:16:58', 1, 1, 1, 1),
(69, 'aslkfj xa&ntilde;lksjd lashd', '2017-11-09 06:16:59', 1, 1, 1, 1),
(70, 'al ksfdjx a&ntilde;sjd a', '2017-11-09 06:17:00', 1, 1, 1, 1),
(71, 'a&ntilde;xskjf d xa&ntilde;sjdas', '2017-11-09 06:17:01', 1, 1, 1, 1),
(72, '&ntilde; alsj x&ntilde;asjd &ntilde;asjd', '2017-11-09 06:17:02', 1, 1, 1, 1),
(73, '&ntilde; asjd &ntilde;asjd &ntilde;asljd &ntilde;as', '2017-11-09 06:17:04', 1, 1, 1, 1),
(74, 'lkhsdf lijafs ji&ntilde;asf jajdsf', '2017-11-09 06:17:06', 1, 1, 1, 1),
(75, 'adsfl&ntilde; i j&ntilde;asdfj&ntilde; safd &ntilde;joasfd &ntilde;joasf', '2017-11-09 06:17:07', 1, 1, 1, 1),
(76, 'lkhasfd &ntilde;jasf &ntilde;jasj&ntilde; f&ntilde;jo aosf &ntilde;lj', '2017-11-09 06:17:09', 1, 1, 1, 1),
(77, 'l&ntilde; asj &ntilde;dasl d&ntilde;alksd alksj&ntilde;d as', '2017-11-09 06:17:11', 1, 1, 1, 1),
(78, 'p&ntilde;o as&ntilde;odi kas&ntilde;doi a&ntilde;sodj a&ntilde;sd', '2017-11-09 06:17:13', 1, 1, 1, 1),
(79, '&ntilde; asjlkd &ntilde;aosi d&ntilde;als d&ntilde;aousd', '2017-11-09 06:17:14', 1, 1, 1, 1),
(80, '&ntilde; asodj &ntilde;as id&ntilde;askd &ntilde;asd', '2017-11-09 06:17:16', 1, 1, 1, 1),
(81, '&ntilde;alskd &ntilde;aslkd a&ntilde;ksld', '2017-11-09 06:17:17', 1, 1, 1, 1),
(82, '&ntilde;asldk a&ntilde;slkd as&ntilde;dk', '2017-11-09 06:17:18', 1, 1, 1, 1),
(83, 'lajsdla jsdlkjasd', '2017-11-09 06:17:29', 1, 1, 1, 1),
(84, 'p oaskd oapsmdaspod', '2017-11-09 06:17:32', 1, 1, 1, 1),
(85, 'poaskjd a&ntilde;lmx asom a&ntilde;sld', '2017-11-09 06:17:34', 1, 1, 1, 1),
(86, '&ntilde;alskmd &ntilde;alsdm &ntilde;alsmdapsd', '2017-11-09 06:17:36', 1, 1, 1, 1),
(87, 'a&ntilde; lsdkm&ntilde;alsdm &ntilde;asd', '2017-11-09 06:17:37', 1, 1, 1, 1),
(88, '&ntilde;laskmd &ntilde;alsm d&ntilde;asd', '2017-11-09 06:17:38', 1, 1, 1, 1),
(89, '&ntilde;a sldk ma&ntilde;sldk a&ntilde;smp&ntilde; msad', '2017-11-09 06:17:39', 1, 1, 1, 1),
(90, 'as&ntilde; dmlk a&ntilde;slm &ntilde;asl md&ntilde;alsm d&ntilde;lamsd', '2017-11-09 06:17:41', 1, 1, 1, 1),
(91, '&ntilde;alsk da&ntilde;slkd a&ntilde;lsk da&ntilde;smdq', '2017-11-09 06:17:43', 1, 1, 1, 1),
(92, '&ntilde; aslkmd &ntilde;asldm a{l&ntilde;sm d&ntilde;alsmd &ntilde;asmd&ntilde; asd', '2017-11-09 06:17:45', 1, 1, 1, 1),
(93, '&ntilde;asmd &ntilde;asmd&ntilde;asm das', '2017-11-09 06:17:46', 1, 1, 1, 1),
(94, '&ntilde; aslkmd a&ntilde;lksd a&ntilde;slmd am&ntilde;sd', '2017-11-09 06:17:48', 1, 1, 1, 1),
(95, '&ntilde;oaskd &ntilde;alskd &ntilde;alskd &ntilde;alks d', '2017-11-09 06:17:50', 1, 1, 1, 1),
(96, '&ntilde;lasmdk &ntilde;alsk d&ntilde;lask d&ntilde;mas md', '2017-11-09 06:17:52', 1, 1, 1, 1),
(97, '&ntilde;alsmd &ntilde;alsmd &ntilde;asm dam&ntilde;sd', '2017-11-09 06:17:54', 1, 1, 1, 1),
(98, '&ntilde;l amsd &ntilde;alsmd &ntilde;alsmd &ntilde;alm sd', '2017-11-09 06:17:56', 1, 1, 1, 1),
(99, 'o aijsdpasjda&ntilde;lsdj laj sd', '2017-11-09 06:18:01', 1, 1, 1, 1),
(100, '&ntilde;alskd &ntilde;aslkd &ntilde;aslkd &ntilde;alks d&ntilde;asd', '2017-11-09 06:18:03', 1, 1, 1, 1),
(101, '&ntilde; laskd &ntilde;alskd a&ntilde;slkd &ntilde;laskd a', '2017-11-09 06:18:07', 1, 1, 1, 1),
(102, 'kajs dhlas d', '2017-11-09 06:18:25', 1, 1, 1, 1),
(103, 'lkasj daljs&ntilde;d', '2017-11-09 06:18:27', 1, 1, 1, 1),
(104, 'l&ntilde;aksjd laskjd', '2017-11-09 06:18:28', 1, 1, 1, 1),
(105, 'laisjd als jdasd', '2017-11-09 06:18:45', 1, 1, 1, 1),
(106, '&ntilde;laskd &ntilde;aslkd &ntilde;alskd', '2017-11-09 06:18:47', 1, 1, 1, 1),
(107, 'l&ntilde;askj d&ntilde;alks d&ntilde;lka sd', '2017-11-09 06:18:49', 1, 1, 1, 1),
(108, '&ntilde;laskd &ntilde;alskd &ntilde;laks d', '2017-11-09 06:18:51', 1, 1, 1, 1),
(109, 'a&ntilde;sldk &ntilde;aslkd', '2017-11-09 06:18:52', 1, 1, 1, 1),
(110, 'as&ntilde;ldk &ntilde;aslkd &ntilde;as', '2017-11-09 06:18:53', 1, 1, 1, 1),
(111, '&ntilde;alsdk &ntilde;aslk d', '2017-11-09 06:18:54', 1, 1, 1, 1),
(112, '&ntilde;aslkd &ntilde;aslkd as', '2017-11-09 06:18:55', 1, 1, 1, 1),
(113, '.&ntilde;lask d&ntilde;alks d&ntilde;asd', '2017-11-09 06:18:57', 1, 1, 1, 1),
(114, '&ntilde;alslk d&ntilde;alsk d&ntilde;as', '2017-11-09 06:18:58', 1, 1, 1, 1),
(115, 'oiqwuweoiuqwnepu qw', '2017-11-09 06:19:22', 1, 1, 1, 1),
(116, 'aopioj udaosijd poij sda', '2017-11-09 06:19:24', 1, 1, 1, 1),
(117, 'paojs dpasj das', '2017-11-09 06:19:25', 1, 1, 1, 1),
(118, 'laks jdlaskj kdjasd', '2017-11-09 06:19:46', 1, 1, 1, 1),
(119, 'olsakjd laskjd alsjd', '2017-11-09 06:19:48', 1, 1, 1, 1),
(120, 'laksj dlaskjd asjlk', '2017-11-09 06:19:49', 1, 1, 1, 1),
(121, 'kjaj hdskajs hdkljas hdlasj ads', '2017-11-09 06:20:19', 1, 1, 1, 1),
(122, 'oiajs dlkajs ldka sjd', '2017-11-09 06:20:21', 1, 1, 1, 1),
(123, 'lkasj dlaksj dlkasj d', '2017-11-09 06:20:23', 1, 1, 1, 1),
(124, 'lkja sdlkjas dlkajs das', '2017-11-09 06:20:40', 1, 1, 1, 1),
(125, 'poaskd ak&ntilde;sd a&ntilde;skd', '2017-11-09 06:20:42', 1, 1, 1, 1),
(126, '&ntilde;alskld a&ntilde;sldk &ntilde;aksd', '2017-11-09 06:20:43', 1, 1, 1, 1),
(127, '&ntilde;alskd &ntilde;alsk d&ntilde;as d&ntilde;lka sd', '2017-11-09 06:20:45', 1, 1, 1, 1),
(128, 'laksd a&ntilde;slk d&ntilde;aks d', '2017-11-09 06:20:47', 1, 1, 1, 1),
(129, '&ntilde;alsdk a&ntilde;slkd aks l&ntilde;d', '2017-11-09 06:20:49', 1, 1, 1, 1),
(130, '&ntilde;lask d&ntilde;lask d&ntilde;klasd', '2017-11-09 06:20:51', 1, 1, 1, 1),
(131, 'lias udlas dlask djalsk', '2017-11-09 06:21:25', 1, 1, 1, 1),
(132, 'lkasj dlasj dljaks', '2017-11-09 06:21:26', 1, 1, 1, 1),
(133, 'lasj dalskj da', '2017-11-09 06:21:28', 1, 1, 1, 1),
(134, 'alksdj alskjd jalksd', '2017-11-09 06:21:30', 1, 1, 1, 1),
(135, 'a&ntilde;sl dj alskjd aslkjd', '2017-11-09 06:21:32', 1, 1, 1, 1),
(136, '&ntilde;alskjd alskdj laksj d', '2017-11-09 06:21:33', 1, 1, 1, 1),
(137, 'lkjasj dlaksj dlkasj dlkas jdaksd', '2017-11-09 06:21:59', 1, 1, 1, 1),
(138, 'lkasj dlaksj dalskj dajslk das', '2017-11-09 06:22:02', 1, 1, 1, 1),
(139, 'lkasjd alskjd laksj das', '2017-11-09 06:22:05', 1, 1, 1, 1),
(140, 'akjs hdklasj dklasjd laksjd laksj da', '2017-11-09 06:25:49', 1, 1, 1, 1),
(141, 'kajs dklasjd laskjd laskjd', '2017-11-09 06:25:59', 1, 1, 1, 1),
(142, '12345', '2017-11-09 06:26:17', 1, 1, 1, 1),
(143, '89778978978', '2017-11-09 06:26:25', 1, 1, 1, 1),
(144, 'lkias djlkasj dlas', '2017-11-09 06:43:54', 1, 1, 1, 1),
(145, 'k&ntilde;asl djas&ntilde;lkdas', '2017-11-09 06:43:57', 1, 1, 1, 1),
(146, '}', '2017-11-09 06:44:03', 1, 1, 1, 1),
(147, 'asdasd', '2017-11-09 06:44:07', 1, 1, 1, 1),
(148, 'asdasd', '2017-11-09 06:44:12', 1, 1, 1, 1),
(149, 'lkasdj alksj dals', '2017-11-09 06:44:33', 1, 1, 1, 1),
(150, 'kjas dhkasdasd', '2017-11-09 06:44:37', 1, 1, 1, 1),
(151, 'jh fj hjh f', '2017-11-09 06:48:31', 1, 1, 1, 1),
(152, 'lkasj dlakjs dlkja sdkas', '2017-11-09 06:50:36', 1, 1, 1, 1),
(153, '&ntilde;alskd &ntilde;aslkd a&ntilde;skl d', '2017-11-09 06:50:39', 1, 1, 1, 1),
(154, 'a&ntilde;lskd &ntilde;aslk da', '2017-11-09 06:50:41', 1, 1, 1, 1),
(155, '12243523', '2017-11-09 06:50:44', 1, 1, 1, 1),
(156, '123123', '2017-11-09 06:50:45', 1, 1, 1, 1),
(157, '4132', '2017-11-09 06:50:48', 1, 1, 1, 1),
(158, '123123', '2017-11-09 06:50:50', 1, 1, 1, 1),
(159, 'asdasdas', '2017-11-09 06:51:14', 2, 1, 1, 1),
(160, 'asdasd', '2017-11-09 06:51:16', 2, 1, 1, 1),
(161, 'asdasdqw', '2017-11-09 06:51:18', 2, 1, 1, 1),
(162, 'asdasd', '2017-11-09 06:51:46', 2, 1, 1, 1),
(163, '98127891287978912', '2017-11-09 06:52:00', 1, 1, 1, 1),
(164, 'laksjd alsk hdasdl', '2017-11-09 06:52:02', 1, 1, 1, 1),
(165, '9812398712789312', '2017-11-09 06:52:21', 1, 1, 1, 1),
(166, 'kliA LKSAJ DLAKSJD ALSD', '2017-11-09 06:52:23', 1, 1, 1, 1),
(167, '&Ntilde;LKASJ DLKASJ D&Ntilde;AJSKD &Ntilde;ASLKJDA&Ntilde;SDA&Ntilde;S DJAS&Ntilde; DJA&Ntilde;SJD ASD', '2017-11-09 06:52:27', 1, 1, 1, 1),
(168, 'AKLSJD &Ntilde;ASOD &Ntilde;ASLKD A&Ntilde;SLD A&Ntilde;SLKD &Ntilde;ASD&Ntilde;KAS D&Ntilde;LKAS &Ntilde;LDK AS&Ntilde;LDK A&Ntilde;SLKD &Ntilde;ASLKD &Ntilde;ALSKD &Ntilde;ASLKD &Ntilde;ALSK D&Ntilde;ALSK D&Ntilde;ALSK D&Ntilde;LASK &Ntilde;K &ntilde;lk &ntilde;laksd &ntilde;asldk a&ntilde;slkd &ntilde;alskd &ntilde;aslkd &ntilde;lask d&ntilde;lask d&ntilde;laks &ntilde;dlaks d&ntilde;laks &ntilde;dlka s&ntilde;ldk a&ntilde;slkd &ntilde;alskd &ntilde;lask d&ntilde;lask d', '2017-11-09 06:52:38', 1, 1, 1, 1),
(169, 'hola mundo', '2017-11-09 06:54:38', 1, 1, 1, 1),
(170, '*que tal*', '2017-11-09 06:54:44', 1, 1, 1, 1),
(171, 'Que onda pa', '2017-11-09 07:03:16', 7, 1, 1, 1),
(172, 'como estas?', '2017-11-09 07:03:21', 7, 1, 1, 1),
(173, 'como sigue mi mam&aacute;?', '2017-11-09 07:03:30', 7, 1, 1, 1),
(174, 'jkasjkasjkd', '2017-11-09 07:22:01', 1, 1, 1, 1),
(175, 'Que onda carnal', '2017-11-09 08:13:38', 4, 1, 1, 1),
(176, 'como estas', '2017-11-09 08:13:40', 4, 1, 1, 1),
(177, 'espero que chingon', '2017-11-09 08:13:45', 4, 1, 1, 1),
(178, 'Amorsito hermoso', '2017-11-09 08:13:56', 5, 1, 1, 1),
(179, 'como estas', '2017-11-09 08:13:58', 5, 1, 1, 1),
(180, 'ya te extra&ntilde;o', '2017-11-09 08:14:02', 5, 1, 1, 1),
(181, 'ya te quiero ver', '2017-11-09 08:14:06', 5, 1, 1, 1),
(182, 'que pedo', '2017-11-09 08:16:49', 1, 1, 1, 1),
(183, 'contestame', '2017-11-09 08:16:55', 1, 1, 1, 1),
(184, 'que pedo luisito', '2017-11-09 08:19:43', 2, 1, 1, 1),
(185, 'como vamos con gossip', '2017-11-09 08:19:48', 2, 1, 1, 1),
(186, 'me estas quedando un poco mal', '2017-11-09 08:19:55', 2, 1, 1, 1),
(187, 'espero que ya te pongas las pilas', '2017-11-09 08:20:02', 2, 1, 1, 1),
(188, 'segun ibamos a salir para finales del mes pasado', '2017-11-09 08:20:23', 2, 1, 1, 1),
(189, 'hola', '2017-11-09 09:16:51', 1, 2, 2, 1),
(190, 'que tal', '2017-11-09 09:16:54', 1, 2, 2, 1),
(191, 'Hola', '2017-11-09 09:19:13', 1, 1, 2, 1),
(192, 'Que onda como te va', '2017-11-09 09:20:08', 1, 1, 2, 1),
(193, 'Pues ahi leve y tu que cuentas we', '2017-11-09 09:20:19', 1, 1, 1, 1),
(194, 'pues solo paso a reportarme', '2017-11-09 09:20:58', 1, 1, 1, 1),
(195, 'te mando muchos saludos canijo', '2017-11-09 09:21:07', 1, 1, 1, 1),
(196, 'gracias no tenias por qu&eacute;', '2017-11-09 09:21:16', 1, 1, 2, 1),
(197, 'pero aun asi grqacias', '2017-11-09 09:21:32', 1, 1, 2, 1),
(198, 'eres un perro', '2017-11-09 09:22:18', 1, 1, 2, 1),
(199, 'y tu una perra', '2017-11-09 09:22:30', 1, 1, 1, 1),
(200, 'que pedo', '2017-11-09 15:44:05', 1, 1, 1, 1),
(201, 'woooooooola', '2017-11-09 15:44:19', 1, 1, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `representante`
--

CREATE TABLE `representante` (
  `rep_id` int(11) NOT NULL,
  `rep_nombre` varchar(300) COLLATE latin1_spanish_ci DEFAULT NULL,
  `rep_email` varchar(100) COLLATE latin1_spanish_ci DEFAULT NULL,
  `rep_telefono` varchar(30) COLLATE latin1_spanish_ci DEFAULT NULL,
  `rep_estatus` int(11) DEFAULT NULL,
  `ctc_id` int(11) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `key` varchar(60) COLLATE latin1_spanish_ci DEFAULT NULL,
  `emp_id` int(11) DEFAULT NULL,
  `cli_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `representante`
--

INSERT INTO `representante` (`rep_id`, `rep_nombre`, `rep_email`, `rep_telefono`, `rep_estatus`, `ctc_id`, `timestamp`, `key`, `emp_id`, `cli_id`) VALUES
(1, 'Alejandro Grijalva Antonio', 'alejandro@griant.mx', '5548671990', 1, 1, '2017-10-24 17:02:45', '71aa1b8bfc17343e747876606d820ae8', 1, 1),
(2, 'Luis Antonio Garcia Perrusquia', 'luis@griant.mx', '546789090', 1, 1, '2017-10-24 19:42:33', 'ba789c1ea67bc30e2c35f78cda8694e4', 1, 2),
(3, 'Mariso Rodriguez', 'marisol@griant.mx', '12312312312', 1, 1, '2017-10-24 19:44:41', '4ef5edec684ec441bb81cd4af48e9076', 1, 3),
(4, 'Jose Javier Grijalva Antonio', 'javivi@griant.mx', '344567890', 1, 2, '2017-11-03 01:27:02', '94f737165cc1217d256d2cd9ef4de114', 1, 1),
(5, 'Norma Lilia Sanchez Ferrer', 'lilia@griant.mx', '87127878923', 1, 2, '2017-11-03 17:05:55', 'fa6277e0b4a433a85a91ef08cf824cb1', 1, 1),
(6, 'Josefina Antonio Contreras', 'jose@griant.mx', '65897908', 1, 2, '2017-11-03 17:10:14', '92cbc8df959d93d85d28df7702ab3f9a', 1, 1),
(7, 'Cresencio Grijalva Carrizal', 'chencho@griant.mx', '34567890', 1, 2, '2017-11-03 17:13:15', '4c1c6a88de3c3afd5dacecaab1e5b02f', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `usu_id` int(11) NOT NULL,
  `usu_usuario` varchar(150) COLLATE latin1_spanish_ci DEFAULT NULL,
  `usu_password` varchar(50) COLLATE latin1_spanish_ci DEFAULT NULL,
  `usu_estatus` int(11) DEFAULT '1',
  `cu_id` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `emp_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`usu_id`, `usu_usuario`, `usu_password`, `usu_estatus`, `cu_id`, `timestamp`, `emp_id`) VALUES
(1, 'esteban@loladisenio.com.mx', 'qwerty', 1, 2, '2017-10-24 16:15:22', 1),
(2, 'alejandro@griant.mx', 'qwerty', 1, 2, '2017-10-24 16:15:22', 2),
(4, 'leonardo@loladisenio.com.mx', 'qwerty', 1, 3, '2017-10-24 16:34:13', 1),
(8, 'alejandro@griant.mx', 'qwerty', 1, 4, '2017-10-24 17:02:45', 1),
(9, 'luis@griant.mx', 'qwerty', 1, 4, '2017-10-24 19:42:33', 1),
(10, 'marisol@griant.mx', 'qwerty', 1, 4, '2017-10-24 19:44:41', 1),
(11, 'normita@griant.mx', 'qwerty', 1, 3, '2017-10-24 19:46:31', 1),
(12, 'javivi@griant.mx', 'qwerty', 1, 4, '2017-11-03 01:27:02', 1),
(13, 'lilia@griant.mx', 'qwerty', 1, 4, '2017-11-03 17:05:55', 1),
(14, 'jose@griant.mx', 'qwerty', 1, 4, '2017-11-03 17:10:14', 1),
(15, 'chencho@griant.mx', 'qwerty', 1, 4, '2017-11-03 17:13:15', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `catalogoarea`
--
ALTER TABLE `catalogoarea`
  ADD PRIMARY KEY (`ca_id`);

--
-- Indices de la tabla `catalogotipocliente`
--
ALTER TABLE `catalogotipocliente`
  ADD PRIMARY KEY (`ctc_id`);

--
-- Indices de la tabla `catalogousuario`
--
ALTER TABLE `catalogousuario`
  ADD PRIMARY KEY (`cu_id`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`cli_id`);

--
-- Indices de la tabla `clientearea`
--
ALTER TABLE `clientearea`
  ADD PRIMARY KEY (`clar_id`);

--
-- Indices de la tabla `clienteejecutivo`
--
ALTER TABLE `clienteejecutivo`
  ADD PRIMARY KEY (`clej_id`);

--
-- Indices de la tabla `configuracionempresa`
--
ALTER TABLE `configuracionempresa`
  ADD PRIMARY KEY (`conf_id`);

--
-- Indices de la tabla `ejecutivo`
--
ALTER TABLE `ejecutivo`
  ADD PRIMARY KEY (`eje_id`);

--
-- Indices de la tabla `ejecutivoarea`
--
ALTER TABLE `ejecutivoarea`
  ADD PRIMARY KEY (`ejar_id`);

--
-- Indices de la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`emp_id`);

--
-- Indices de la tabla `empresaarea`
--
ALTER TABLE `empresaarea`
  ADD PRIMARY KEY (`empar_id`);

--
-- Indices de la tabla `estatuscliente`
--
ALTER TABLE `estatuscliente`
  ADD PRIMARY KEY (`esc_id`);

--
-- Indices de la tabla `estatusejecutivo`
--
ALTER TABLE `estatusejecutivo`
  ADD PRIMARY KEY (`ese_id`);

--
-- Indices de la tabla `historialestatusejecutivo`
--
ALTER TABLE `historialestatusejecutivo`
  ADD PRIMARY KEY (`hee_id`);

--
-- Indices de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`men_id`);

--
-- Indices de la tabla `representante`
--
ALTER TABLE `representante`
  ADD PRIMARY KEY (`rep_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`usu_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `catalogoarea`
--
ALTER TABLE `catalogoarea`
  MODIFY `ca_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT de la tabla `catalogotipocliente`
--
ALTER TABLE `catalogotipocliente`
  MODIFY `ctc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `cli_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `clientearea`
--
ALTER TABLE `clientearea`
  MODIFY `clar_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT de la tabla `clienteejecutivo`
--
ALTER TABLE `clienteejecutivo`
  MODIFY `clej_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
--
-- AUTO_INCREMENT de la tabla `configuracionempresa`
--
ALTER TABLE `configuracionempresa`
  MODIFY `conf_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `ejecutivo`
--
ALTER TABLE `ejecutivo`
  MODIFY `eje_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `ejecutivoarea`
--
ALTER TABLE `ejecutivoarea`
  MODIFY `ejar_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT de la tabla `empresa`
--
ALTER TABLE `empresa`
  MODIFY `emp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `empresaarea`
--
ALTER TABLE `empresaarea`
  MODIFY `empar_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT de la tabla `estatuscliente`
--
ALTER TABLE `estatuscliente`
  MODIFY `esc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT de la tabla `estatusejecutivo`
--
ALTER TABLE `estatusejecutivo`
  MODIFY `ese_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT de la tabla `historialestatusejecutivo`
--
ALTER TABLE `historialestatusejecutivo`
  MODIFY `hee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `men_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=202;
--
-- AUTO_INCREMENT de la tabla `representante`
--
ALTER TABLE `representante`
  MODIFY `rep_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `usu_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
