var tablesjs = {
  init: () => {
    tablesjs.read();
  },
  read: () => {
    fetch('Output.txt')
    .then((response) => {
      return response.text();
    })
    .then((text) => {
      var obj = tablesjs.parse(text);
      var txt = tablesjs.createTable(obj);
      tablesjs.obj = obj;

      document.getElementById("results").innerHTML = txt;

    })
  },
  gen: (text) => {

    //Need to generate the links, sections and tables
    // top links and to top links to navigate

    //Might want an id for the output note

  },
  reGen: () => {
    var txt = tablesjs.createTable(tablesjs.obj);
    document.getElementById("results").innerHTML = txt;
  },
  obj: {},
  parse: (data) => {
    var returnObj = data.split(/\r?\n/);

    var i = 0;
    var j = 0;

    for(i = 0; i < returnObj.length; i++){
      returnObj[i] = returnObj[i].split(",");

      for(j = 0; j < returnObj[i].length; j++){
        returnObj[i][j] = returnObj[i][j].split(": ");
      }

    }

    if(returnObj[returnObj.length-1] == `{}`){
      returnObj.splice(-1)
    }

    var obj = {};
    var index = "";

    for(i = 0; i < returnObj.length; i++){
      obj[i] = {}

      for(j = 0; j < returnObj[i].length; j++){
        index = returnObj[i][j][0].replace(/\s/g, "");
        if(returnObj[i][j][0] != ''){
          obj[i][index] = returnObj[i][j][1];
        }
        else{
          console.log(returnObj[i][j]);
        }
      }

    }

    return obj;
  },
  createTable: (obj) => {

    var tdArray = [];
    var tdArrayTemp = [];

    for(var key in obj){
      for(var key2 in obj[key]){
        if(obj[key][key2] != undefined){
          tdArrayTemp.push(`${key2}____${obj[key][key2]}`);
        }
      }
      if(tdArrayTemp[0] != undefined){
        tdArray.push(tdArrayTemp);
      }
      tdArrayTemp = [];
    }

    tdArray = tablesjs.indexArray(tdArray);

    var idCheck = "";
    var checkHeader = true;

    var txt = ``;

    for(var i = 0; i < tdArray.length; i++){
      if(tdArray[i][0] != '____ undefined'){
        if(checkHeader){
          txt = tablesjs.createHeader(tdArray[i]);
          txt = txt + tablesjs.createHeaders(tdArray[i]);
          checkHeader = false;
        }
        if(tdArray[i][0] != idCheck && idCheck != ""){
          txt = txt + `</table>\n`
          txt = txt + tablesjs.createBottom(tdArray[i-1]);
          txt = txt + `<br></br>`
          txt = txt + tablesjs.createHeader(tdArray[i]);
          txt = txt + tablesjs.createHeaders(tdArray[i]);
        }
        txt = txt +  `<tr>\n`;
        for(var j = 0; j < tdArray[i].length; j++){
          if(tdArray[i][tdArray[i].length-1].split("____")[1] == tablesjs.index[tdArray[i][0].split("____")[1]]){
            txt = txt + `<td>${tdArray[i][j].split("____")[1]}</td>\n`
          }
        }
        txt = txt +  `</tr>\n`;
        idCheck = tdArray[i][0];
      }
    }

    txt = txt + `</table>\n`;
    txt = txt + tablesjs.createBottom(tdArray[i-1]);
    txt = txt + `<br><a id="bottom" href="#header">Overall Top</a>\n
    <br></br>\n`;

    return txt;

  },
  createHeaders: (row) =>{

    var txt = "";

    for(var keys in row){
      txt = txt + `<td>${row[keys].split("____")[0]}</td>\n`
    }

    return txt;
  },
  createHeader: (row) =>{

    var txt = "";
    var count = 0;

    for(var keys in row){
      if(count == 0){
        txt = txt + `<h3 id="link_${row[keys].split("____")[1]}">${row[keys].split("____")[1]} <a href="#bottom_${row[keys].split("____")[1]}" class="bottom">bottom</a></h3>\n`
      }
      count++;
    }

    txt = txt + `<table class="table" id="table-${row[0].split("____")[1]}">\n`;

    return txt;
  },
  createBottom: (row) =>{

    var txt = "";
    var count = 0;

    for(var keys in row){
      if(count == 0){
        console.log(row[keys].split("____")[1], tablesjs.index, tablesjs.indexCheck)
        // txt = `<a id="bottom_${row[keys].split("____")[1]}" name="${row[keys].split("____")[1]}" onclick="tablesjs.funUp()" class="select">UP</a>`;
        //Change to input field
        txt = txt + ` <input type="number" name="${row[keys].split("____")[1]}" style="width: 4em;" value="${tablesjs.index[row[keys].split("____")[1]]}" onchange="tablesjs.funChange(this)">`
        // txt = txt + ` <a id="down_${row[keys].split("____")[1]}" name="${row[keys].split("____")[1]}" onclick="tablesjs.funDown()" class="select">Down</a>\n`;
        txt = txt +  `<br>\n`;
        txt = txt + ` <a id="bottom_${row[keys].split("____")[1]}" href="#link_${row[keys].split("____")[1]}">Top</a>`;
        txt = txt + ` <a id="bottom_${row[keys].split("____")[1]}" onclick="tablesjs.createCVS()" class="select">Export</a>`;
      }
      count++;
    }

    return txt;
  },
  funUp: (el) => {
    console.log(el);
    tablesjs.index[el.name]++;
    tablesjs.reGen();
  },
  funDown: (el) => {
    tablesjs.index[el.name]--;
    tablesjs.reGen();
  },
  funChange: (el) => {
    if(tablesjs.index[el.name] != parseInt(el.value) && el.value != ""){
      tablesjs.index[el.name] = parseInt(el.value);
      tablesjs.reGen();
    }
  },
  indexArray: (tdArray) => {

    // sort by date
    tdArray.sort(function(a, b) {
      var nameA = Date(a[1].split("____")[1]); // ignore upper and lowercase
      var nameB = Date(b[1].split("____")[1]); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });

    // sort by id
    tdArray.sort(function(a, b) {
      var nameA = a[0].split("____")[1]; // ignore upper and lowercase
      var nameB = b[0].split("____")[1]; // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });

    var i = 0;
    var count = 0;
    var saveID = "";

    for(i = 0; i < tdArray.length; i++){

      if(tablesjs.indexCheck[tdArray[i][0].split("____")[1]] == undefined){
        tablesjs.indexCheck[tdArray[i][0].split("____")[1]] = true;
      }

      if(tdArray[i][0].split("____")[1] != saveID && i != 0 && count > 1){

        if(tablesjs.indexCheck[tdArray[i-1][0].split("____")[1]]){
          tablesjs.index[tdArray[i-1][0].split("____")[1]] = Math.floor((count-1)/10);
          tablesjs.indexCheck[tdArray[i-1][0].split("____")[1]] = false;
        }

        count = 0;

      }

      tdArray[i].push(`SetIndex____ ${Math.floor(count/10)}`);

      count++;

      saveID = tdArray[i][0].split("____")[1];

    }

    if(tablesjs.indexCheck[tdArray[i-1][0].split("____")[1]]){
      tablesjs.index[tdArray[i-1][0].split("____")[1]] = Math.floor((count-1)/10);
      tablesjs.indexCheck[tdArray[i-1][0].split("____")[1]] = false;
      count = 0;
    }

    var check = [];

    for(i = 0; i < tdArray.length; i++){
      check = tdArray[i][tdArray[i].length-1].split("____")[1];
    }

    return tdArray;
  },
  index: {},
  indexCheck: {},
  createCVS: function(){

    //need to make this be able to based on the id selected - likely in the for loop

    var arrayVal = [];

    for(var keys in tablesjs.obj){
      if(tablesjs.obj[keys]["id"] != undefined ){
        arrayVal.push(tablesjs.obj[keys]);
      }
    }

    const json = arrayVal;
    var fields = Object.keys(json[0])
    var replacer = function(key, value) { return value === null ? '' : value }
    var csv = json.map(function(row){
      return fields.map(function(fieldName){
        return JSON.stringify(row[fieldName], replacer)
      }).join(',')
    })
    csv.unshift(fields.join(',')) // add header column
    csv = csv.join('\r\n');

    function downloadBlob(content, filename, contentType) {
      // Create a blob
      var blob = new Blob([content], { type: contentType });
      var url = URL.createObjectURL(blob);

      // Create a link to download it
      var pom = document.createElement('a');
      pom.href = url;
      pom.setAttribute('download', filename);
      pom.click();
    }

    downloadBlob(csv, 'data-tracker.csv', 'text/csv;charset=utf-8;');

  }
}

//tablesjs.init();
