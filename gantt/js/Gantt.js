$(function(){
    gantt.Start();//页面初始化创建
    gantt.addContent();//页面内容数据加载
});

var gantt = new Object();

//页面初始化
gantt.Start = function(){
    $('.ganttContainer').append('<div class="ganttTitle"></div>');
    $('.ganttContainer').append('<div class="ganttTable"></div>');
    $('.ganttTable').append('<div class="tableLeft"></div>');
    $('.ganttTable').append('<div class="tableRight"></div>');
    $('.tableRight').append('<table class="tableGrid"></table>');
    $('.tableGrid').append('<tr class="gridHead"></tr>');
//    $('.gridHead').append('<td colspan=""></td><td></td><td></td>')
    $('.tableLeft').append('<table class="tableTitle"></table>');
    $('.tableTitle').append('<tr class="titleHead"><td>序号</td><td>项目内容</td><td>关联部门</td><td>备注</td></tr>');
}

var Num;//甘特图一级内容的个数
var Second;//获取甘特图二级内容
var num;//甘特图二级内容的个数(循环里面获取到的，循环外不能直接用！)

//页面内容数据加载
gantt.addContent = function(){
    $.ajax({
        url:'./json/content.json',
        type:'GET',
        dataType:'json',
        async:false,
        success:function(content){
            var ganttTitle = content.title;//获取甘特图标题    
            var ganttData = content.data;//获取甘特图一级内容
            Num = ganttData.length;//一级标题的个数
//            console.log((ganttData[0].children)[0].name)
            
            $('.ganttTitle').text(ganttTitle);//插入甘特图标题
            gantt.insertLeft(Num,ganttData);//插入表单左侧所有内容           
        },
        error:function(){
            alert('error!');
        }
    })
}

//插入表单内所有的内容
//Num--需要插入的一级序号的个数
//First--获取的甘特图一级内容
gantt.insertLeft = function(Num,First){
    var timeArr = [];//放置所有时间的数组
    var nameArr = [];//放置所有name的数组
    var departmentArr = [];//放置所有department的数组
    var remarkArr = [];//放置所有remark的数组
    
    for(var i=0;i<Num;i++){
        $('.tableTitle').append('<tr class="titleContentF" rowspan="2"><td class="Order">'+(i+1)+'</td><td class="Name"></td><td class="Department"></td><td class="Remark"></td></tr>');//插入一级内容的表格并插入一级序号
//        console.log($('.titleContentF').eq(i).html());
        Second = First[i].children;//获取甘特图二级内容
        num = Second.length;
        $('.Name').eq(i).text(First[i].name);//插入一级项目内容
        for(var j=0;j<num;j++){
            $('.titleContentF').eq(i).after('<tr class="titleContentS" rowspan="2"><td class="order">'+(i+1)+'.'+(num-j)+'</td><td class="name"></td><td class="department"></td><td class="remark"></td></tr>');//插入二级内容的表格并插入二级序号
            
            var nameGather = Second[j].name;
            nameArr.push(nameGather);//获取二级内容集合并组成数组
            var departmentGather = Second[j].department;
            departmentArr.push(departmentGather);//获取二级部门集合并组成数组
            var remarkGather = Second[j].remark;
            remarkArr.push(remarkGather);//获取二级备注集合并组成数组
            
            var planStart = Second[j].plan_start_time;
            var planStartChange = planStart.replace(/-/g,'/');//得到所有的计划开始时间并格式化
            var planEnd = Second[j].plan_end_time;
             var planEndChange = planEnd.replace(/-/g,'/');//得到所有的计划结束时间并格式化
            var realStart = Second[j].real_start_time;
            var realStartChange = realStart.replace(/-/g,'/');//得到所有的真实开始时间并格式化
            var realEnd = Second[j].real_end_time;
            var realEndChange = realEnd.replace(/-/g,'/');//得到所有的真实结束时间并格式化
    //        console.log(planStart);

            timeArr.push(planStartChange);
            timeArr.push(planEndChange);
            timeArr.push(realStartChange);
            timeArr.push(realStartChange);//将所有已经格式化的时间拼成一个数组  
        }
    }
    
    gantt.insertRight();
    
    for(var n=0;n<nameArr.length;n++){
        $('.name').eq(n).text(nameArr[n]);//插入name内容
        $('.department').eq(n).text(departmentArr[n]);//插入department内容
        $('.remark').eq(n).text(remarkArr[n]);//插入remark内容
    }
    
    var arrSort = timeArr.sort();//获取的时间数组从小到大排序
//    console.log(arrSort);
    var firstTime = arrSort.shift();
    var lastTime = arrSort.pop();//获取时间的最小和最大值
//    console.log(firstTime);
//    console.log(lastTime);
    var gridL =(new Date(lastTime)-new Date(firstTime))/(1000*3600*24)+1;
//    console.log(gridL);
    
    gantt.insertRight();//设置格子的行数
    for(var k=0;k<gridL;k++){
//        console.log(1);
        $('.gridBody').append('<td class="grid"></td>');//设置格子的列数
    }
    
    $('.gridBody').eq(1).children('.grid').eq(0).css('background-color','blue');
    $('.gridBody').eq(2).children('.grid').eq(0).css('background-color','red');
}
//设置格子的行数
gantt.insertRight = function(){
    var height = $('.tableLeft').height()-1;
//    console.log(height);
    $('.tableRight').css('height',height);//根据左侧标题的高度设置整个格子的高度
    var gridR=($('.titleContentF').length+$('.titleContentS').length);
    for(var i=0;i<gridR;i++){
        $('.gridHead').after('<tr class="gridBody"></tr>');//设置格子的行数（为左侧标题的两倍）
    }
}


