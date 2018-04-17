// JavaScript Document

//动态切换
function nTabs(thisObj,Num){
if(thisObj.className == "fleft inblock width80 current")return;
var tabObj = thisObj.parentNode.id;
var tabList = document.getElementById(tabObj).getElementsByTagName("li");
for(i=0; i <tabList.length; i++)
{
  if (i == Num)
  {
   thisObj.className = "fleft inblock width80 current"; 
      document.getElementById(tabObj+"_Content"+i).style.display = "block";
  }else{
   tabList[i].className = "fleft inblock  width80 normal"; 
   document.getElementById(tabObj+"_Content"+i).style.display = "none";
  }
} 
}


	



