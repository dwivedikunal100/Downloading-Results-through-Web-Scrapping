var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();



var branchcode=['00','10','30','13','20','51','40','55','82','84','85','86','87'];
var branchname=['ce','cs','et','it','ee','ch','me','be','ft','ot','pt','lt','pl'];
GetAllBranches();

/*
  Website not responding well on 1170 requests..
  Get Data one by one 
  However for using loop 
  1>remove below '//'
  2>replace marks/${branchname[0]}.txt by marks/${branchname[i]}.txt 
  3>replace GetBranchData(0); GetBranchData(i);
*/

function GetAllBranches(){
//	for(var i=0;i<13;i++){

fs.writeFile(`marks/${branchname[0]}.txt`, "", function(err) {
    if(err) {
        return console.log(err);
    }   
});
GetBranchData(0);
//}
}


function GetBranchData(index){
for(var i=1;i<=90;i++)
{
if(i<10){
var rollnumber=`15045${branchcode[index]}00${i}`;
GetData(index,rollnumber);
}

else{
var rollnumber=`15045${branchcode[index]}0${i}`;
GetData(index,rollnumber);
}
}

}



function GetData(index,ROLLNUMBER){
var url=`http://hbtu.ac.in/results/odd_2017/hbtiodd222qp17e.asp?rollno=${ROLLNUMBER}`;
var name="null",marks="null",branch="null";
var OUTPUT;

OUTPUT=request(url, function(error, response, html){
if(!error){
var $ = cheerio.load(html);

$('td').map(function(i, el) {
 
if($(this).prev().text()=="Name:")
name=$(this).text();

if($(this).prev().text()=="TOTAL MARKS")
marks=$(this).text();
  
if($(this).prev().text()=="Course/Branch:")
branch=$(this).text();
  
return $(this).attr('class');
}).get().join(', ');

if(name!="null" && marks!="null" && branch!="null"){
OUTPUT='NAME\t'+name+'\tBRANCH\t'+branch+'\tMARKS\t'+marks.split('/')[0]+'\n';

fs.appendFile(`marks/${branchname[index]}.txt`, OUTPUT, function(err){if(err) return console.log(err);}); 
}  
}
else{console.log("Connection Failed");}
})
}

