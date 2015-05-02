/**
 * Created by Kirill on 01.05.2015.
 */

var Checker = function (x, y, color) {
    this.X = x;
    this.Y = y;
    this.Color = color;
    this.Queen=false;
    this.PossibleToEat=false;
};

var YourCheckers = [];
var EnemyCheckers = [];

var GlobalYourEatNextTurn=false;
var GlobalEnemyEatNestTurn=false;

var DetectedEnemyChecker;

var SelectedChecker;

var cellSize=50;

function RenderDesc(value){

    var tableElement=document.createElement("table");
    tableElement.setAttribute("border", "5");
    tableElement.setAttribute("id", "mainTable");
    var trColor=false;
    var counter=1;
    for (var i = 0; i < value; i++) {
        var trElement=document.createElement("tr");
        trColor=!trColor;
        var tdColor=trColor;
        for (var j = 0; j < value; j++) {
            var tdElement=document.createElement("td");
            tdElement.setAttribute("width", cellSize);
            tdElement.setAttribute("height", cellSize);
            tdElement.setAttribute("border", "5");
            tdElement.setAttribute("align", "center");
            tdElement.setAttribute("x",i);
            tdElement.setAttribute("y",j);
            if(tdColor==true){
                tdElement.setAttribute("class", "black");
                if((counter >= 1 && counter <=24) || (counter >=40 && counter <=64)){
                    if(counter >= 1 && counter <=24){
                        tdElement.appendChild(RenderChecker(true));
                    }
                    else{
                        tdElement.appendChild(RenderChecker(false));
                    }

                    if(counter >= 1 && counter <=24){
                        var checker= new Checker(i,j,true);
                        YourCheckers[YourCheckers.length]=checker;
                    }
                    else{
                        var checker= new Checker(i,j,false);
                        EnemyCheckers[EnemyCheckers.length]=checker;
                    }
                }

            }
            else{
                tdElement.setAttribute("class", "white");
            }
            tdElement.addEventListener("click", onCellClick, false);
            counter=counter+1;
            tdColor=!tdColor;

            trElement.appendChild(tdElement);
        };
        tableElement.appendChild(trElement);
    }
    document.body.appendChild(tableElement);
}

function GetTdByCoordinates(x, y){
    var table=document.getElementById("mainTable");
    for(var i=0; i < table.childElementCount; i++){
        var trElement=table.childNodes[i];
        for(var j=0; j< trElement.childElementCount; j++){
            var tdElement=trElement.childNodes[j];
            if(tdElement.getAttribute("x")==x && tdElement.getAttribute("y")==y){
                return tdElement;
            }
        }
    }
}


function Check(oldX, oldY, newX, newY, color, queen){
    oldX=parseInt(oldX);
    oldY=parseInt(oldY);
    newX=parseInt(newX);
    newY=parseInt(newY);

    if(CheckPositionForYourCheckers(newX,newY)==true){
        return -1;
    }

    if(CheckPositionForEnemyCheckers(newX, newY)==true){
        return -1;
    }

    // ��������� �������������� �� ��� �� ���������
    var xAbs=Math.abs(newX-oldX);
    var yAbs=Math.abs(newY-oldY);
    if(xAbs!=yAbs){
        return -1;
    }

    //��������� ������� �� ���������� � � �

    var differenceX=newX-oldX;
    var differenceY=newY-oldY;

    if(!queen){//������� �����. �� �����
        if(Math.abs(differenceX)>2 || Math.abs(differenceY)>2){//������� ����� �� ����� ������ ����� ��� �� 2 ������
            return -1;
        }

        if(color){
            if(differenceX<0) {
                return -1;
            }
        }
        else{
            if(differenceX>0){
                return -1;
            }
        }

        if(Math.abs(differenceX)==1 && Math.abs(differenceY)==1){ // ������ ���. ������ �� ����
            return 0;
        }
        // ���� �� ����� �� ����, ������ �� �������� ����-�� ������.
        if(CheckEnemiesBetween(oldX,oldY,newX,newY)==1){
            return 1;
        }
        else{
            return -1;
        }
    }
    else{
        var result=CheckEnemiesBetween(oldX, oldY, newX, newY);
        if(result==0){
            return 0;
        }
        if(result==1){
            return 1;
        }
        if(result==2){
            return -1;
        }
    }
    return -1;
}

function CheckPositionForYourCheckers(x,y){
    for(var i=0; i< YourCheckers.length; i++){
        if(YourCheckers[i].X==x && YourCheckers[i].Y==y){
            return true;
        }
    }
    return false
}

function CheckPositionForEnemyCheckers(x,y){
    for(var i=0; i< EnemyCheckers.length; i++){
        if(EnemyCheckers[i].X==x && EnemyCheckers[i].Y==y){
            return true;
        }
    }
    return false
}

function CheckEnemiesBetween(oldX, oldY, newX, newY){
    oldX=parseInt(oldX);
    oldY=parseInt(oldY);
    newX=parseInt(newX);
    newY=parseInt(newY);

    var enemiesCount=0;
    DetectedEnemyChecker=null;

    var differenceX=newX-oldX;
    var differenceY=newY-oldY;

    var coefX=0;
    if(differenceX >0){
        coefX=1;
    }
    else{
        coefX=-1;
    }
    var coefY=0;
    if(differenceY>0){
        coefY=1;
    }
    else{
        coefY=-1;
    }

    var currentX=oldX;
    var currentY=oldY;
    while(true){
        currentX=currentX+coefX;
        currentY=currentY+coefY;
        if(currentX==newX){
            break;
        }
        for (var i=0; i<EnemyCheckers.length; i++){
            if(EnemyCheckers[i].X==currentX && EnemyCheckers[i].Y==currentY){
                enemiesCount=enemiesCount+1;
                DetectedEnemyChecker=EnemyCheckers[i];
                if(enemiesCount>=2){
                    DetectedEnemyChecker=null;
                    return 2;
                }
            }
        }
        for(var i=0; i<YourCheckers.length; i++){
            if(YourCheckers[i].X==currentX && YourCheckers[i].Y==currentY){
                DetectedEnemyChecker=null;
                return 2;
            }
        }
    }
    return enemiesCount;
}

function RenderChecker(color){
    var img=document.createElement("img");
    if(color){
        img.setAttribute("src", "red.jpg");
    }
    else{
        img.setAttribute("src", "black.jpg");
    }
    img.setAttribute("width",cellSize/2);
    img.setAttribute("height",cellSize/2);
    img.setAttribute("class","checker");
    return img;
}

function CheckForPossibleEat(){
    GlobalYourEatNextTurn=false;
    for (var i=0; i<YourCheckers.length; i++){
        YourCheckers[i].PossibleToEat=false;
        var currentChecker=YourCheckers[i];
        if(!(currentChecker.Queen)){
            if(currentChecker.Color){ // ��� �����
                var newX=parseInt(currentChecker.X) +2;
                if(newX>7 || newX <0){
                    continue;
                }
                else{
                    var newY1=parseInt(currentChecker.Y)+2;
                    if(newY1<=7 && newY1 >=0){
                        if(CheckPositionForEnemyCheckers(newX,newY1)==false && CheckPositionForYourCheckers(newX,newY1)==false) {
                            var result = CheckEnemiesBetween(currentChecker.X, currentChecker.Y, newX, newY1);
                            if (result == 1) {
                                currentChecker.PossibleToEat = true;
                                GlobalYourEatNextTurn = true;
                            }
                        }
                    }
                    var newY2=parseInt(currentChecker.Y)-2;
                    if(newY2 <=7 && newY2>=0){
                        if(CheckPositionForEnemyCheckers(newX,newY2)==false && CheckPositionForYourCheckers(newX,newY2)==false) {
                            var result = CheckEnemiesBetween(currentChecker.X, currentChecker.Y, newX, newY2);
                            if (result == 1) {
                                currentChecker.PossibleToEat = true;
                                GlobalYourEatNextTurn = true;
                            }
                        }
                    }
                }
            }
            else{// ��� ������
                var newX=parseInt(currentChecker.X) -2;
                if(newX>7 || newX <0){
                    continue;
                }
                else{
                    var newY1=parseInt(currentChecker.Y)+2;
                    if(newY1<=7 && newY1 >=0){
                        if(CheckPositionForEnemyCheckers(newX,newY1)==false && CheckPositionForYourCheckers(newX,newY1)==false) {
                            var result = CheckEnemiesBetween(currentChecker.X, currentChecker.Y, newX, newY1);
                            if (result == 1) {
                                currentChecker.PossibleToEat = true;
                                GlobalYourEatNextTurn = true;
                            }
                        }
                    }
                    var newY2=parseInt(currentChecker.Y)-2;
                    if(newY2 <=7 && newY2>=0){
                        if(CheckPositionForEnemyCheckers(newX,newY2)==false && CheckPositionForYourCheckers(newX,newY2)==false) {
                            var result = CheckEnemiesBetween(currentChecker.X, currentChecker.Y, newX, newY2);
                            if (result == 1) {
                                currentChecker.PossibleToEat = true;
                                GlobalYourEatNextTurn = true;
                            }
                        }
                    }
                }
            }
        }
        else {//���� ����� - �����
            var currentX = parseInt(currentChecker.X);
            var currentY = parseInt(currentChecker.Y);

            var tryX=currentX+2;
            var tryY=currentY+2;
            while(true){ // X ���������� Y ����������
                if((tryX>7 || tryX <0) || (tryY>7 || tryY<0)){
                    break;
                }
                if(CheckPositionForEnemyCheckers(tryX,tryY)==true){
                    tryX++;
                    tryY++;
                    continue;
                }
                if(CheckPositionForYourCheckers(tryX,tryY)==true){
                    tryX++;
                    tryY++;
                    continue;
                }
                if(CheckEnemiesBetween(currentX,currentY,tryX,tryY)==1){
                    currentChecker.PossibleToEat = true;
                    GlobalYourEatNextTurn = true;
                }
                tryX++;
                tryY++;
            }

            tryX=currentX+2;
            tryY=currentY-2;
            while(true){ // X ���������� Y ���������
                if((tryX>7 || tryX <0) || (tryY>7 || tryY<0)){
                    break;
                }
                if(CheckPositionForEnemyCheckers(tryX,tryY)==true){
                    tryX++;
                    tryY--;
                    continue;
                }
                if(CheckPositionForYourCheckers(tryX,tryY)==true){
                    tryX++;
                    tryY--;
                    continue;
                }
                if(CheckEnemiesBetween(currentX,currentY,tryX,tryY)==1){
                    currentChecker.PossibleToEat = true;
                    GlobalYourEatNextTurn = true;
                }
                tryX++;
                tryY--;
            }

            tryX=currentX-2;
            tryY=currentY+2;
            while(true){ // X ��������� Y ����������
                if((tryX>7 || tryX <0) || (tryY>7 || tryY<0)){
                    break;
                }
                if(CheckPositionForEnemyCheckers(tryX,tryY)==true){
                    tryX--;
                    tryY++;
                    continue;
                }
                if(CheckPositionForYourCheckers(tryX,tryY)==true){
                    tryX--;
                    tryY++;
                    continue;
                }
                if(CheckEnemiesBetween(currentX,currentY,tryX,tryY)==1){
                    currentChecker.PossibleToEat = true;
                    GlobalYourEatNextTurn = true;
                }
                tryX--;
                tryY++;
            }

            tryX=currentX-2;
            tryY=currentY-2;
            while(true){ // X ��������� Y ���������
                if((tryX>7 || tryX <0) || (tryY>7 || tryY<0)){
                    break;
                }
                if(CheckPositionForEnemyCheckers(tryX,tryY)==true){
                    tryX--;
                    tryY--;
                    continue;
                }
                if(CheckPositionForYourCheckers(tryX,tryY)==true){
                    tryX--;
                    tryY--;
                    continue;
                }
                if(CheckEnemiesBetween(currentX,currentY,tryX,tryY)==1){
                    currentChecker.PossibleToEat = true;
                    GlobalYourEatNextTurn = true;
                }
                tryX--;
                tryY--;
            }
        }
    }
}

function CheckChekersAvailability(){
    if(YourCheckers.length<=0){
        ShowLooserBox();
    }
    if(EnemyCheckers.length<=0){
        ShowWinnerBox();
    }
}

function onCellClick(item){
    var element=item.currentTarget;
    if(SelectedChecker==null){
        var currentX=element.getAttribute('x');
        var currentY=element.getAttribute('Y');
        for(var i=0; i<YourCheckers.length;i++){
            if(YourCheckers[i].X==currentX && YourCheckers[i].Y==currentY){
                SelectedChecker=YourCheckers[i];
                break;
            }
        }
        if(SelectedChecker==null){
            return;
        }

        CheckForPossibleEat();

        if(GlobalYourEatNextTurn==true){
            if(SelectedChecker.PossibleToEat==false){
                SelectedChecker=null;
                return;
            }
        }

        for (var i = 0; i < element.childNodes.length; i++) {
            if (element.childNodes[i].className == "checker") {
                var img = element.childNodes[i];
                img.setAttribute("width", 30);
                img.setAttribute("height", 30);
            }
        }

    }
    else{
        var currentX=element.getAttribute('x');
        var currentY=element.getAttribute('Y');

        var result=Check(SelectedChecker.X, SelectedChecker.Y, currentX,currentY,
            SelectedChecker.Color, SelectedChecker.Queen);



        if(result==0){ // ������ ���, ������ �� �����
            if(GlobalYourEatNextTurn==true){
                return;
            }
           var oldTd= GetTdByCoordinates(SelectedChecker.X, SelectedChecker.Y);
            oldTd.removeChild(oldTd.childNodes[0]);
            var newTd=GetTdByCoordinates(currentX, currentY);
            var checkerImg=RenderChecker(SelectedChecker.Color);
            newTd.appendChild(checkerImg);
            SelectedChecker.X=currentX;
            SelectedChecker.Y=currentY;

            if(SelectedChecker.Color==true && currentX==7){
                SelectedChecker.Queen=true;
            }
            if(SelectedChecker.Color==false && currentX==0){
                SelectedChecker.Queen=true;
            }

            CheckChekersAvailability();

            var tempArray=YourCheckers;
            YourCheckers=EnemyCheckers;
            EnemyCheckers=tempArray;

            var tempVariable=GlobalYourEatNextTurn;
            GlobalYourEatNextTurn=GlobalEnemyEatNestTurn;
            GlobalEnemyEatNestTurn=tempVariable;

        }
        if(result ==1){ //����-�� �����
            MustEatThisTurn=false;
            var enemyTd = GetTdByCoordinates(DetectedEnemyChecker.X, DetectedEnemyChecker.Y);
            enemyTd.removeChild(enemyTd.childNodes[0]);

            var deletedIndex=EnemyCheckers.indexOf(DetectedEnemyChecker);
            EnemyCheckers.splice(deletedIndex,1);

            // ������ � �����
            var oldTd= GetTdByCoordinates(SelectedChecker.X, SelectedChecker.Y);
            oldTd.removeChild(oldTd.childNodes[0]);
            var newTd=GetTdByCoordinates(currentX, currentY);
            var checkerImg=RenderChecker(SelectedChecker.Color);
            newTd.appendChild(checkerImg);
            SelectedChecker.X=currentX;
            SelectedChecker.Y=currentY;

            if(SelectedChecker.Color==true && currentX==7){
                SelectedChecker.Queen=true;
            }
            if(SelectedChecker.Color==false && currentX==0){
                SelectedChecker.Queen=true;
            }

            CheckForPossibleEat();

            if(GlobalYourEatNextTurn==true){
                SelectedChecker = null;
                return;
            }

            CheckChekersAvailability();

            var tempArray=YourCheckers;
            YourCheckers=EnemyCheckers;
            EnemyCheckers=tempArray;

            var tempVariable=GlobalYourEatNextTurn;
            GlobalYourEatNextTurn=GlobalEnemyEatNestTurn;
            GlobalEnemyEatNestTurn=tempVariable;
            // �����
        }
        if(result ==-1) {
            var tdElement = GetTdByCoordinates(SelectedChecker.X, SelectedChecker.Y);
            if (tdElement != null) {
                for (var i = 0; i < tdElement.childNodes.length; i++) {
                    if (tdElement.childNodes[i].className == "checker") {
                        var img = tdElement.childNodes[i];
                        img.setAttribute("width", cellSize / 2);
                        img.setAttribute("height", cellSize / 2);
                    }
                }
            }
        }
        SelectedChecker = null;
    }

}


function ShowWinnerBox(){
    $('#overlay').fadeIn('fast',function(){
        $('#winnerBox').animate({'top':'160px'},500);
    });
}

function ShowLooserBox(){
    $('#overlay').fadeIn('fast',function(){
        $('#looserBox').animate({'top':'160px'},500);
    });
}

function ShowWelcomeBox(){
    $('#overlay').fadeIn('fast',function(){
        $('#welcomeBox').animate({'top':'160px'},500);
    });
}

function NameEntered() {
    var name = document.getElementsByName("name")[0].value;
    $('#welcomeBox').animate({'top': '-200px'}, 500, function () {
        $('#overlay').fadeOut('fast');
    });
    setTimeout(function () {
        $('#overlay').fadeIn('fast', function () {
            $('#waitBox').animate({'top': '160px'}, 500);
        });
    }, 1000);
}



/*
$(function() {
    $('#activator').click(function(){
        $('#overlay').fadeIn('fast',function(){
            $('#box').animate({'top':'160px'},500);
        });
    });
    $('#boxclose').click(function(){
        $('#box').animate({'top':'-200px'},500,function(){
            $('#overlay').fadeOut('fast');
        });
    });

});*/