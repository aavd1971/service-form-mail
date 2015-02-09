<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <link rel="stylesheet" href="css/main.css"/>
</head>
<body>
<div id="wr" class="view">
    <h1>Заявки</h1>
    <a id="form_rs" href="/">форма заявки</a>
<?
include_once('DbConnect.php');
//$dbt = 'free_rs';
try{
    $conn = DbConnect::get();
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT * FROM ".DbConnect::$dbt;
    ?>
<table id="res">
    <th>#</th>
    <th>фио</th><th>имя</th><th>отчество</th><th>телефон</th><th>email</th>
    <th>паспорт</th><th>выдан</th><th>дата выдачи</th><th colspan="2">код подразделения</th>
    <th>место рождения</th><th>согласен</th><th>отправлено</th><th>время отправления</th><th>время на заполнение</th>
    <?
    $i = 0;
    foreach($conn->query($sql) as $el):?>
        <tr>
            <td><?=++$i?></td>
            <td><?=$el['fio'];?></td>
            <td><?=$el['name'];?></td>
            <td><?=$el['surname'];?></td>
            <td><?=$el['tel'];?></td>
            <td><?=$el['email'];?></td>
            <td><?=$el['passport'];?></td>
            <td><?=$el['output'];?></td>
            <td><?=$el['data_output'];?></td>
            <td><?=$el['kod1'];?></td>
            <td><?=$el['kod2'];?></td>
            <td><?=$el['place'];?></td>
            <td><?= ($el['confirm']) ? 'да' : 'нет';?></td>
            <td><?= ($el['sended'])  ? 'да' : 'нет';?></td>
            <td><?= ($el['curtime']);?></td>
            <td><?= ($el['time']);?></td>
        </tr>
    <?php endforeach;?>
</table>
<?
}catch (Exception $e){
    $data = new stdClass();
    $data->res = $e->getMessage();
    echo json_encode($data);
    exit;
}
?>
</div>
</body>
</html>
