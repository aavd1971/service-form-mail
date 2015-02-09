<?php
class DbConnect{
    private static $host = 'localhost';
    private static $dbn = 'dondov_db1';
    private static $dbu = 'dondov_db1';
    private static $dbp = '04121971';
    public static $dbt = 'free_rs';

    static function get(){
        $str = "mysql:host=".self::$host.";dbname=".self::$dbn;
        return new PDO($str,self::$dbu,self::$dbp);
    }

    static function test_connect(){
        $conn = DbConnect::get();
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT * FROM ".self::$dbt;
        foreach($conn->query($sql) as $el){
            echo $el['id'];
        }
    }
}

//DbConnect::test_connect();