<?php



$wxdata=array(
	"code"=>$_GET["code"],
	"rawData"=>$_GET["rawData"],
	"signature"=>$_GET["signature"],
	"encryptedData"=>$_GET["encryptedData"],
	"iv"=>$_GET["iv"]
);

// echo json_encode($data);


$curl = curl_init();  
$url='https://api.weixin.qq.com/sns/jscode2session?appid=wxb75642b42cc5707f&secret=d637acdfd6e4e98d884571c9276fec86&js_code='.$wxdata['code'].'&grant_type=authorization_code';

//设置抓取的url  
curl_setopt($curl, CURLOPT_URL,$url );  
//设置头文件的信息作为数据流输出  
curl_setopt($curl, CURLOPT_HEADER, 1);  
//设置获取的信息以文件流的形式返回，而不是直接输出。  
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);  
//执行命令  
$data = curl_exec($curl);  

$array=explode('{', $data);

$rejson='{'.$array[1];

$a=json_decode($rejson);
$outdata=Array(
	'code'=>curl_getinfo($curl,CURLINFO_HTTP_CODE),//输出请求状态码  
	'session_key'=>$a->session_key,
	'openid'=>$a->openid
);

//关闭URL请求  
curl_close($curl);  

echo json_encode($outdata);
?>
