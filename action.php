<?
include_once('DbConnect.php');

function check($val){
    return  htmlspecialchars(addslashes($val));
}
if(isset($_POST)){
    $fio = check($_POST['fio']);
    $name = check($_POST['name']);
    $surname = check($_POST['surname']);
    $tel = check($_POST['tel']);
    $email = check($_POST['email']);
    $output = check($_POST['output']);
    $data_output = check($_POST['data_output']);
    $passport = check($_POST['passport']);
    $kod1 = check($_POST['kod1']);
    $kod2 = check($_POST['kod2']);
    $place = check($_POST['place']);
    $confirm = check($_POST['confirm']);
    $time = check($_POST['time']);

    $confirm = ($confirm) ? 1 : 0;

    //$dbt = 'rs';
	//$dbt = 'free_rs';

    try{
        $conn = DbConnect::get();
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "INSERT INTO ".DbConnect::$dbt." (fio,name,surname,tel,email,passport,output,data_output,
                kod1,kod2,place,confirm,time) VALUES
                ('".$fio."','".$name."','".$surname."','".$tel."','".$email."','".$passport."','".$output."',
                '".$data_output."','".$kod1."','".$kod2."','".$place."','".$confirm."',SEC_TO_TIME(".$time."))";
//        echo $sql;exit;
        $conn->exec($sql);

        $id = $conn->lastInsertId();

        $to = 'aavd@mail.ru';
        $sub = 'тема письма';
        $message =
<<<LETTER
<html>
    <head>
        <title>рассылка писем</title>
        <meta charset="UTF-8">
    </head>
    <body>
        <h1>вам письмо, дорогой $fio!</h1>
    </body>
</html>
LETTER;
        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "from: test@mail.ru";
		/*
        if(mail($to,$sub,$message,$headers)){
            $sql = "UPDATE $dbt SET sended = 1 where id = $id";
            $conn->exec($sql);
        }else{
            new Exception('error mail sended');
        }
		*/

    }catch (Exception $e){
        $data = new stdClass();
        $data->res = $e->getMessage();
        echo json_encode($data);
        exit;
    }

    $data = new stdClass();
    $data->res = 'ok';
    $data->data = $_POST;
    echo json_encode($data);
}
