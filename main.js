fetch('./data.json')
.then(response => response.json())
.then(data => {

    dt = new Date();

    currAcadYear = dt.getFullYear();
    if(dt.getMonth()>5) currAcadYear++;

    query = "";
    info = [];
    url = "https://lichess.org/api/users";
    dataTemp = [];

    t1 = document.getElementById("standingsCurrBlitz");
    t2 = document.getElementById("standingsCurrBullet");
    t3 = document.getElementById("standingsCurrRapid");
    curr = ((t1!=null) || (t2!=null) || (t3!=null));

    for(let i = 0; i < data.length; i++){
        if(curr && data[i][3]<currAcadYear) continue;
        query += data[i][0] + ',';
        dataTemp.push(data[i]);
    }

    query = query.slice(0, -1); 
    data = dataTemp;

    fetch(url, {
        method: "POST",
        body: query,
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())
    .then(json => {

        for(let i = 0; i < json.length; i++){
            ratings = getRatings(json[i]);
            if(ratings === null) continue;

            arr = [data[i][1], json[i].username, ratings[0], ratings[1], ratings[2], data[i][2], data[i][3], data[i][4], timeDifference(Date.now(),json[i].seenAt)];

            info.push(arr);
        }

        displayBlitz(info);
        displayBullet(info);
        displayRapid(info);
    });    
})

function extractRating(json){

    if(json === undefined || json === null) return 0;
    if(json.prov === true) return 0;

    return json.rating;
}

function getRatings(details){

    if(details == null || details.error == "Not found" || details.disabled===true) 
        return null;
        
    blitzDetail = details.perfs.blitz;
    bulletDetail = details.perfs.bullet;
    rapidDetail = details.perfs.rapid;
    
    return [extractRating(blitzDetail),extractRating(bulletDetail),extractRating(rapidDetail)];
}

function timeDifference(current, previous) {

    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerMonth = msPerDay * 30;
    let msPerYear = msPerDay * 365;

    let elapsed = current - previous;

    if (elapsed < msPerMinute) {
        let x = Math.round(elapsed/1000)-1;
        return x + ' second' + (x==1 ? '' : 's')  + ' ago';   
    }

    else if (elapsed < msPerHour) {
        let x = Math.round(elapsed/msPerMinute)-1;
        return x + ' minute' + (x==1 ? '' : 's') +' ago';   
    }

    else if (elapsed < msPerDay ) {
        let x = Math.round(elapsed/msPerHour);
        return x + ' hour' + (x==1 ? '' : 's') + ' ago';   
    }

    else if (elapsed < msPerMonth) {
        let x = Math.round(elapsed/msPerDay);
        return x + ' day' + (x==1 ? '' : 's') + ' ago';   
    }

    else if (elapsed < msPerYear) {
        let x = Math.round(elapsed/msPerMonth);
        return x + ' month' + (x==1 ? '' : 's') + ' ago';   
    }

    else {
        let x = Math.round(elapsed/msPerYear);
        return x + ' year' + (x==1 ? '' : 's') +' ago';   
    }
}

function compare(x, y){
    if(x[2] > y[2]) return -1;
    if(x[2] < y[2]) return 1;
    
    if(x[3] > y[3]) return -1;
    if(x[3] < y[3]) return 1;

    if(x[4] > y[4]) return -1;
    if(x[4] < y[4]) return 1;

    return 0;
}

function getQueryString(standings, order){
    answer = "";
    profileLink = "https://lichess.org/@/*";
    performance = "/perf/";

    sample = '<tr> <td style="font-weight: 550;">#*</td> <td>*</td> <td><a href = "*">*</a></td> <td><a href = "*">*</a></td>  <td><a href = "*">*</a></td> <td><a href = "*">*</a></td> </tr>';
    
    for(let i = 0; i < standings.length; i++){
        currString = sample.replace('*', standings[i][9]);
        currLink = profileLink.replace('*',standings[i][1]);
        
        currString = currString.replace('*', standings[i][0]);

        currString = currString.replace('*', currLink);
        currString = currString.replace('*', standings[i][1]);

        currString = currString.replace('*', currLink + performance + order[0]);
        currString = currString.replace('*', standings[i][2] == 0 ? '?' : standings[i][2]);

        currString = currString.replace('*', currLink + performance + order[1]);
        currString = currString.replace('*', standings[i][3] == 0 ? '?' : standings[i][3]);

        currString = currString.replace('*', currLink + performance + order[2]);
        currString = currString.replace('*', standings[i][4] == 0 ? '?' : standings[i][4]);

        answer += currString;
    }

    return answer;
}

function getQueryStringPhone(standings, type){
    answer = "";
    profileLink = "https://lichess.org/@/*";
    performance = "/perf/";

    sample = '<tr> <td style="font-weight: 550;">#*</td> <td>*</td> <td><a href = "*">*</a></td> <td><a href = "*">*</a></td> </tr>';
    
    for(let i = 0; i < standings.length; i++){
        currString = sample.replace('*', standings[i][9]);
        currLink = profileLink.replace('*',standings[i][1]);
        
        currString = currString.replace('*', standings[i][0]);

        currString = currString.replace('*', currLink);
        currString = currString.replace('*', standings[i][1]);

        currString = currString.replace('*', currLink + performance + type);
        currString = currString.replace('*', standings[i][2] == 0 ? '?' : standings[i][2]);

        answer += currString;
    }

    return answer;
}

function getHeight(){

    var B = document.body, H = document.documentElement, height;

    if (typeof document.height !== 'undefined') {
        height = document.height 
    } else {
        height = Math.max( B.scrollHeight, B.offsetHeight,H.clientHeight, H.scrollHeight, H.offsetHeight );
    }

    return height;
}

function setPopUp(htmlElement, rank, name, branch, pass, id, active, url){

    lichessId = '<a href="https://lichess.org/@/*">*</a>';    
    linkedInUrl = '<a href="*" target=”_blank”><img src="images/LinkedIN.svg" alt="LinkedIN"></img></a>';

    htmlElement.addEventListener("click", () => {
        document.getElementById("pop-up-rank").innerHTML = '#'+rank;
        document.getElementById("pop-up-name").innerHTML = name;
        document.getElementById("pop-up-branch").innerHTML = branch
        document.getElementById("pop-up-pass").innerHTML = pass;
        document.getElementById("pop-up-lichess").innerHTML = lichessId.replace('*',id).replace('*',id);
        document.getElementById("pop-up-active").innerHTML = active;
        document.getElementById("pop-up").classList.remove("None");

        if(url.length){
            document.getElementById("pop-up-Image").innerHTML = linkedInUrl.replace('*',url);
            document.getElementById("pop-up-connect").style.display = "flex";
        }
        else document.getElementById("pop-up-connect").style.display = "none";
    });
}

function setPopUpPhone(htmlElement, rank, name, branch, pass, id, active, url, opacityEle){

    lichessId = '<a href="https://lichess.org/@/*">*</a>';    
    linkedInUrl = '<a href="*" target=”_blank”><img src="images/LinkedIN.svg" alt="LinkedIN"></img></a>';

    htmlElement.addEventListener("click", () => {
        document.getElementById("pop-up-rank-Phone").innerHTML = '#'+rank;
        document.getElementById("pop-up-name-Phone").innerHTML = name;
        document.getElementById("pop-up-branch-Phone").innerHTML = branch
        document.getElementById("pop-up-pass-Phone").innerHTML = pass;
        document.getElementById("pop-up-lichess-Phone").innerHTML = lichessId.replace('*',id).replace('*',id);
        document.getElementById("pop-up-active-Phone").innerHTML = active;
        document.getElementById("pop-up-Phone").classList.remove("None");

        if(url.length){
            document.getElementById("pop-up-Image-Phone").innerHTML = linkedInUrl.replace('*',url);
            document.getElementById("pop-up-connect-Phone").style.display = "flex";
        }
        else document.getElementById("pop-up-connect-Phone").style.display = "none";

        document.getElementById("ontop").classList.remove("None");
        document.getElementsByTagName("header")[0].classList.add("Opacity");
        document.getElementsByClassName("Phone-Leaderboard")[0].classList.add("Opacity");
        document.getElementsByClassName("Buttons")[0].classList.add("Opacity");
        document.getElementsByTagName("footer")[0].classList.add("Opacity");
        opacityEle.classList.add("Opacity");
    });
}

function displayBlitz(info){

    blitzTableAll = document.getElementById("standingsAllBlitz");
    blitzTableCurr = document.getElementById("standingsCurrBlitz");
    blitzTable = (blitzTableAll == null ? blitzTableCurr : blitzTableAll);

    if(blitzTable == null) return;  

    blitzTableAllPhone = document.getElementById("standingsAllBlitzPhone");
    blitzTableCurrPhone = document.getElementById("standingsCurrBlitzPhone");
    blitzTablePhone = (blitzTableAllPhone == null ? blitzTableCurrPhone : blitzTableAllPhone);

    info.sort(compare); 

    while(info.length > 0 && info[info.length - 1][2]==0) 
        info.pop();

    info[0].push(1);

    for(let i = 1; i < info.length; i++){
        if(info[i-1][2]===info[i][2]) info[i].push(info[i-1][9]);
        else info[i].push(info[i-1][9]+1);
    }

    document.getElementById("P1Name").innerHTML = info[0][0];
    document.getElementById("P1NamePhone").innerHTML = info[0][0];
    setPopUp(document.getElementById("P1Name"),info[0][9],info[0][0],info[0][5],info[0][6],info[0][1],info[0][8],info[0][7]);
    setPopUpPhone(document.getElementById("P1NamePhone"),info[0][9],info[0][0],info[0][5],info[0][6],info[0][1],info[0][8],info[0][7],blitzTablePhone);
    document.getElementById("P2Name").innerHTML = info[1][0];
    document.getElementById("P2NamePhone").innerHTML = info[1][0];
    setPopUp(document.getElementById("P2Name"),info[1][9],info[1][0],info[1][5],info[1][6],info[1][1],info[1][8],info[1][7]);
    setPopUpPhone(document.getElementById("P2NamePhone"),info[1][9],info[1][0],info[1][5],info[1][6],info[1][1],info[1][8],info[1][7],blitzTablePhone);
    document.getElementById("P3Name").innerHTML = info[2][0];
    document.getElementById("P3NamePhone").innerHTML = info[2][0];
    setPopUp(document.getElementById("P3Name"),info[2][9],info[2][0],info[2][5],info[2][6],info[2][1],info[2][8],info[2][7]);
    setPopUpPhone(document.getElementById("P3NamePhone"),info[2][9],info[2][0],info[2][5],info[2][6],info[2][1],info[2][8],info[2][7],blitzTablePhone);

    ele = '<a href="https://lichess.org/@/*/perf/blitz">*</a>';
    
    document.getElementById("P1Rating").innerHTML = ele.replace('*',info[0][1]).replace('*',info[0][2]);
    document.getElementById("P1RatingPhone").innerHTML = ele.replace('*',info[0][1]).replace('*',info[0][2]);
    document.getElementById("P2Rating").innerHTML = ele.replace('*',info[1][1]).replace('*',info[1][2]);
    document.getElementById("P2RatingPhone").innerHTML = ele.replace('*',info[1][1]).replace('*',info[1][2]);
    document.getElementById("P3Rating").innerHTML = ele.replace('*',info[2][1]).replace('*',info[2][2]);
    document.getElementById("P3RatingPhone").innerHTML = ele.replace('*',info[2][1]).replace('*',info[2][2]);

    htmlPC = '<tr> <th style="width: 4%;">Rank</th> <th style="width: 30%;">Name</th> <th style="width: 30%;">Lichess Id</th> <th style="width: 12%;">Blitz</th> <th style="width: 12%;">Bullet</th> <th style="width: 12%;">Rapid</th> </tr>';
    htmlPC += getQueryString(info, ["blitz", "bullet", "rapid"]);
    blitzTable.innerHTML = htmlPC;

    htmlPhone = '<tr> <th style="width: 5%;">Rank</th> <th style="width: 40%;">Name</th> <th style="width: 40%;">Lichess Id</th> <th style="width: 15%;">Blitz</th> </tr>';
    htmlPhone += getQueryStringPhone(info, "blitz");
    blitzTablePhone.innerHTML = htmlPhone;

    ontopEle = document.getElementById("ontop");

    ontopEle.style.height = getHeight()+"px";
    ontopEle.addEventListener("click", function (event) {
        if(!document.getElementById("pop-up-Phone").contains(event.target)){
            ontopEle.classList.add("None");
            document.getElementsByTagName("header")[0].classList.remove("Opacity");
            document.getElementsByClassName("Phone-Leaderboard")[0].classList.remove("Opacity");
            document.getElementsByClassName("Buttons")[0].classList.remove("Opacity");
            document.getElementsByTagName("footer")[0].classList.remove("Opacity");

            blitzTablePhone.classList.remove("Opacity");
        }
    });

    for (let i = 1, row; row = blitzTable.rows[i]; i++){
        setPopUp(row.cells[0],info[i-1][9],info[i-1][0],info[i-1][5],info[i-1][6],info[i-1][1],info[i-1][8],info[i-1][7]);
        setPopUp(row.cells[1],info[i-1][9],info[i-1][0],info[i-1][5],info[i-1][6],info[i-1][1],info[i-1][8],info[i-1][7]);
    }

    for (let i = 1, row; row = blitzTablePhone.rows[i]; i++){
        setPopUpPhone(row.cells[0],info[i-1][9],info[i-1][0],info[i-1][5],info[i-1][6],info[i-1][1],info[i-1][8],info[i-1][7],blitzTablePhone);
        setPopUpPhone(row.cells[1],info[i-1][9],info[i-1][0],info[i-1][5],info[i-1][6],info[i-1][1],info[i-1][8],info[i-1][7],blitzTablePhone);
    }
}

function displayBullet(info){

    bulletTableAll = document.getElementById("standingsAllBullet");
    bulletTableCurr = document.getElementById("standingsCurrBullet");
    bulletTable = (bulletTableAll == null ? bulletTableCurr : bulletTableAll);

    if(bulletTable == null) return;

    bulletTableAllPhone = document.getElementById("standingsAllBulletPhone");
    bulletTableCurrPhone = document.getElementById("standingsCurrBulletPhone");
    bulletTablePhone = (bulletTableAllPhone == null ? bulletTableCurrPhone : bulletTableAllPhone);

    for(let i = 0; i < info.length; i++) [info[i][2],info[i][3]] = [info[i][3],info[i][2]];

    info.sort(compare);

    while(info.length > 0 && info[info.length - 1][2]==0) 
        info.pop();

    info[0].push(1);

    for(let i = 1; i < info.length; i++){
        if(info[i-1][2]==info[i][2]) info[i].push(info[i-1][9]);
        else info[i].push(info[i-1][9]+1);
    }

    document.getElementById("P1Name").innerHTML = info[0][0];
    document.getElementById("P1NamePhone").innerHTML = info[0][0];
    setPopUp(document.getElementById("P1Name"),info[0][9],info[0][0],info[0][5],info[0][6],info[0][1],info[0][8],info[0][7]);
    setPopUpPhone(document.getElementById("P1NamePhone"),info[0][9],info[0][0],info[0][5],info[0][6],info[0][1],info[0][8],info[0][7],bulletTablePhone);
    document.getElementById("P2Name").innerHTML = info[1][0];
    document.getElementById("P2NamePhone").innerHTML = info[1][0];
    setPopUp(document.getElementById("P2Name"),info[1][9],info[1][0],info[1][5],info[1][6],info[1][1],info[1][8],info[1][7]);
    setPopUpPhone(document.getElementById("P2NamePhone"),info[1][9],info[1][0],info[1][5],info[1][6],info[1][1],info[1][8],info[1][7],bulletTablePhone);
    document.getElementById("P3Name").innerHTML = info[2][0];
    document.getElementById("P3NamePhone").innerHTML = info[2][0];
    setPopUp(document.getElementById("P3Name"),info[2][9],info[2][0],info[2][5],info[2][6],info[2][1],info[2][8],info[2][7]);
    setPopUpPhone(document.getElementById("P3NamePhone"),info[2][9],info[2][0],info[2][5],info[2][6],info[2][1],info[2][8],info[2][7],bulletTablePhone);
    
    ele = '<a href="https://lichess.org/@/*/perf/bullet">*</a>';
    
    document.getElementById("P1Rating").innerHTML = ele.replace('*',info[0][1]).replace('*',info[0][2]);
    document.getElementById("P1RatingPhone").innerHTML = ele.replace('*',info[0][1]).replace('*',info[0][2]);
    document.getElementById("P2Rating").innerHTML = ele.replace('*',info[1][1]).replace('*',info[1][2]);
    document.getElementById("P2RatingPhone").innerHTML = ele.replace('*',info[1][1]).replace('*',info[1][2]);
    document.getElementById("P3Rating").innerHTML = ele.replace('*',info[2][1]).replace('*',info[2][2]);
    document.getElementById("P3RatingPhone").innerHTML = ele.replace('*',info[2][1]).replace('*',info[2][2]);

    htmlPC = '<tr> <th style="width: 4%;">Rank</th> <th style="width: 30%;">Name</th> <th style="width: 30%;">Lichess Id</th> <th style="width: 12%;">Bullet</th> <th style="width: 12%;">Blitz</th> <th style="width: 12%;">Rapid</th> </tr>';
    htmlPC += getQueryString(info, ["bullet", "blitz", "rapid"]);
    bulletTable.innerHTML = htmlPC;

    htmlPhone = '<tr> <th style="width: 5%;">Rank</th> <th style="width: 40%;">Name</th> <th style="width: 40%;">Lichess Id</th> <th style="width: 15%;">Bullet</th> </tr>';
    htmlPhone += getQueryStringPhone(info, "bullet");
    bulletTablePhone.innerHTML = htmlPhone;

    ontopEle = document.getElementById("ontop");

    ontopEle.style.height = getHeight()+"px";
    ontopEle.addEventListener("click", function (event) {
        if(!document.getElementById("pop-up-Phone").contains(event.target)){
            ontopEle.classList.add("None");
            document.getElementsByTagName("header")[0].classList.remove("Opacity");
            document.getElementsByClassName("Phone-Leaderboard")[0].classList.remove("Opacity");
            document.getElementsByClassName("Buttons")[0].classList.remove("Opacity");
            document.getElementsByTagName("footer")[0].classList.remove("Opacity");

            bulletTablePhone.classList.remove("Opacity");
        }
    });

    for (let i = 1, row; row = bulletTable.rows[i]; i++){
        setPopUp(row.cells[0],info[i-1][9],info[i-1][0],info[i-1][5],info[i-1][6],info[i-1][1],info[i-1][8],info[i-1][7]);
        setPopUp(row.cells[1],info[i-1][9],info[i-1][0],info[i-1][5],info[i-1][6],info[i-1][1],info[i-1][8],info[i-1][7]);
    }

    for (let i = 1, row; row = bulletTablePhone.rows[i]; i++){
        setPopUpPhone(row.cells[0],info[i-1][9],info[i-1][0],info[i-1][5],info[i-1][6],info[i-1][1],info[i-1][8],info[i-1][7],bulletTablePhone);
        setPopUpPhone(row.cells[1],info[i-1][9],info[i-1][0],info[i-1][5],info[i-1][6],info[i-1][1],info[i-1][8],info[i-1][7],bulletTablePhone);
    }
}

function displayRapid(info){

    rapidTableAll = document.getElementById("standingsAllRapid");
    rapidTableCurr = document.getElementById("standingsCurrRapid");
    rapidTable = (rapidTableAll == null ? rapidTableCurr : rapidTableAll);

    if(rapidTable == null) return;

    rapidTableAllPhone = document.getElementById("standingsAllRapidPhone");
    rapidTableCurrPhone = document.getElementById("standingsCurrRapidPhone");
    rapidTablePhone = (rapidTableAllPhone == null ? rapidTableCurrPhone : rapidTableAllPhone);

    for(let i = 0; i < info.length; i++) [info[i][2],info[i][3],info[i][4]] = [info[i][4],info[i][2],info[i][3]];

    info.sort(compare);

    while(info.length > 0 && info[info.length - 1][2]==0) 
        info.pop();
    
    info[0].push(1);

    for(let i = 1; i < info.length; i++){
        if(info[i-1][2]==info[i][2]) info[i].push(info[i-1][9]);
        else info[i].push(info[i-1][9]+1);
    }

    document.getElementById("P1Name").innerHTML = info[0][0];
    document.getElementById("P1NamePhone").innerHTML = info[0][0];
    setPopUp(document.getElementById("P1Name"),info[0][9],info[0][0],info[0][5],info[0][6],info[0][1],info[0][8],info[0][7]);
    setPopUpPhone(document.getElementById("P1NamePhone"),info[0][9],info[0][0],info[0][5],info[0][6],info[0][1],info[0][8],info[0][7],rapidTablePhone);
    document.getElementById("P2Name").innerHTML = info[1][0];
    document.getElementById("P2NamePhone").innerHTML = info[1][0];
    setPopUp(document.getElementById("P2Name"),info[1][9],info[1][0],info[1][5],info[1][6],info[1][1],info[1][8],info[1][7]);
    setPopUpPhone(document.getElementById("P2NamePhone"),info[1][9],info[1][0],info[1][5],info[1][6],info[1][1],info[1][8],info[1][7],rapidTablePhone);
    document.getElementById("P3Name").innerHTML = info[2][0];
    document.getElementById("P3NamePhone").innerHTML = info[2][0];
    setPopUp(document.getElementById("P3Name"),info[2][9],info[2][0],info[2][5],info[2][6],info[2][1],info[2][8],info[2][7]);
    setPopUpPhone(document.getElementById("P3NamePhone"),info[2][9],info[2][0],info[2][5],info[2][6],info[2][1],info[2][8],info[2][7],rapidTablePhone);
    
    ele = '<a href="https://lichess.org/@/*/perf/rapid">*</a>';
    
    document.getElementById("P1Rating").innerHTML = ele.replace('*',info[0][1]).replace('*',info[0][2]);
    document.getElementById("P1RatingPhone").innerHTML = ele.replace('*',info[0][1]).replace('*',info[0][2]);
    document.getElementById("P2Rating").innerHTML = ele.replace('*',info[1][1]).replace('*',info[1][2]);
    document.getElementById("P2RatingPhone").innerHTML = ele.replace('*',info[1][1]).replace('*',info[1][2]);
    document.getElementById("P3Rating").innerHTML = ele.replace('*',info[2][1]).replace('*',info[2][2]);
    document.getElementById("P3RatingPhone").innerHTML = ele.replace('*',info[2][1]).replace('*',info[2][2]);

    htmlPC = '<tr> <th style="width: 4%;">Rank</th> <th style="width: 30%;">Name</th> <th style="width: 30%;">Lichess Id</th> <th style="width: 12%;">Rapid</th> <th style="width: 12%;">Blitz</th> <th style="width: 12%;">Bullet</th> </tr>';
    htmlPC += getQueryString(info, ["rapid", "blitz", "bullet"]);
    rapidTable.innerHTML = htmlPC;

    htmlPhone = '<tr> <th style="width: 5%;">Rank</th> <th style="width: 40%;">Name</th> <th style="width: 40%;">Lichess Id</th> <th style="width: 15%;">Rapid</th> </tr>';
    htmlPhone += getQueryStringPhone(info, "rapid");
    rapidTablePhone.innerHTML = htmlPhone;

    ontopEle = document.getElementById("ontop");

    ontopEle.style.height = getHeight()+"px";
    ontopEle.addEventListener("click", function (event) {
        if(!document.getElementById("pop-up-Phone").contains(event.target)){
            ontopEle.classList.add("None");
            document.getElementsByTagName("header")[0].classList.remove("Opacity");
            document.getElementsByClassName("Phone-Leaderboard")[0].classList.remove("Opacity");
            document.getElementsByClassName("Buttons")[0].classList.remove("Opacity");
            document.getElementsByTagName("footer")[0].classList.remove("Opacity");

            rapidTablePhone.classList.remove("Opacity");
        }
    });

    for (let i = 1, row; row = rapidTable.rows[i]; i++){
        setPopUp(row.cells[0],info[i-1][9],info[i-1][0],info[i-1][5],info[i-1][6],info[i-1][1],info[i-1][8],info[i-1][7]);
        setPopUp(row.cells[1],info[i-1][9],info[i-1][0],info[i-1][5],info[i-1][6],info[i-1][1],info[i-1][8],info[i-1][7]);
    }

    for (let i = 1, row; row = rapidTablePhone.rows[i]; i++){
        setPopUpPhone(row.cells[0],info[i-1][9],info[i-1][0],info[i-1][5],info[i-1][6],info[i-1][1],info[i-1][8],info[i-1][7],rapidTablePhone);
        setPopUpPhone(row.cells[1],info[i-1][9],info[i-1][0],info[i-1][5],info[i-1][6],info[i-1][1],info[i-1][8],info[i-1][7],rapidTablePhone);
    }
}