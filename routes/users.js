var express = require('express');
var router = express.Router();
var path = require('path');
const JSON5 = require('json5')
var _ = require('lodash');
var jsonPath = path.join(__dirname, 'data.csv');
var json =[];
var fs =require('fs');
var tagsArr=[];
const csvFilePath=jsonPath;
const csv=require('csvtojson/v1');
/*csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    json = jsonObj;
    var pp=0;
    for(i=0;i<json.length;i++){
      
      tagsArr = tagsArr.concat(json[i].tags.substr(1,json[i].tags.length-2).replace(/'/g, "").split(", "));
    }

    tagsArr = [...new Set(tagsArr)];
    console.log("done");
})*/

fs.readFile(jsonPath, "utf8", (err, data) => {
  if (err) throw err;
  csvTojs(data);
});

function csvTojs(csv) {
  var lines=csv.split("\n");
  var result = [];
  var headers = lines[0].split(",");
  var errCont = 0;
  for(var i=1; i<lines.length; i++) {
    var obj = {};
    var te = lines[1];
    var row = lines[i],
      queryIdx = 0,
      startValueIdx = 0,
      idx = 0;

    if (row.trim() === '') { continue; }

    while (idx < row.length) {
      /* if we meet a double quote we skip until the next one */
      var c = row[idx];

      if (c === '"') {
        do { c = row[++idx]; } while (c !== '"' && idx < row.length - 1);
      }

      if (c === ',' || /* handle end of line with no comma */ idx === row.length - 1) {
        /* we've got a value */
        var value = row.substr(startValueIdx, idx - startValueIdx).trim();

        
      
        /* skip first double quote */
        if (value[0] === '"') { value = value.substr(1); }
      
        /* skip last comma */
        if (value[value.length - 1] === ',') { value = value.substr(0, value.length - 1); }
        /* skip last double quote */
        
        if (value[value.length - 1] === '"') { value = value.substr(0, value.length - 1); }
     
        var key = headers[queryIdx++];
          if(key==="tags" || key==="ratings"){
            
            value = value.replace(/'/g, '"')
            value = value.replace("\"Alzheimer\"s\"", "Alzheimer");
            
            try{
              obj[key] = JSON.parse(value)
              
            }catch(err){
              obj[key] = [];
              errCont++
              
            }
            startValueIdx = idx + 1;
            ++idx;
            continue;
          }
          obj[key] = value;
       
        startValueIdx = idx + 1;
        
      }

      ++idx;
    }

    result.push(obj);
  }
  json= result;
  console.log(errCont);
}
/* GET users listing. */
router.get('/', function(req, res) {
  filterBy = { event: ["TED2007"], tags:["Africa","Moon"]};
  //filterBytags = 
  tag = 'Africa';
  //result = json.filter(u => u.tags.some(t => t.tag.includes(tag)));

  result = json.filter(
            o => Object.keys(filterBy).every(
                k => filterBy[k].some(
                (f) =>  { 
                    if(k=="tags"){
                      return o[k].includes(f)
                    }else{
                      return o[k] === f 
                    }
                    })));
  res.send(json.slice(0,10));  
  
});

module.exports = router;
var uniqEs6 = (arrArg) => {
  return arrArg.filter((elem, pos, arr) => {
    return arr.indexOf(elem) == pos;
  });
}