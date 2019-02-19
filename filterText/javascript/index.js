const REPLACE_VAL = " ";
const SPACE = " ";
const SEPARATOR = ",";
const LINE_BREAK = "\n";
const FILTER_SEPARATOR = "=>";
const FILTER_SEPARATOR_ADD_SPACE = "=>>";
const FINAL_VAL_SEPARATOR = "=";


const searchAndReplaceText = function (value, search, replacement = REPLACE_VAL) {
  
  let safeSearch = search.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  let reg = new RegExp(safeSearch, 'g');
  let finalValue = value.replace(reg, replacement);
  return finalValue.replace(/ +/g, SPACE).trim();

}

const indexText = function(value, separator = REPLACE_VAL) {
  let separatedValue = value.split(separator);

  let idx = 0;
  return _.reduce(separatedValue, (accum, value) => {
    return accum.concat("["+ (idx++) +"]").concat(value).concat(SPACE);
  }, "");

}



window.addEventListener("load", event => {

  let stripText = function(afterReplaceFunc) {
    let replaceText = document.getElementById("replace-field").value.split(",");
    let values = document.getElementById("write-value").value.split(LINE_BREAK);
    let outputValue = "";
  
  
    _.forEach(values, (value) => {
      let idx = 0;
      let newVal = _.reduce(replaceText, (accum, val) => {
        return searchAndReplaceText(accum, val);
      }, value);

      if(_.isFunction(afterReplaceFunc)) {
        outputValue = outputValue.concat(afterReplaceFunc(newVal));
      } else {
        outputValue = outputValue.concat(newVal).concat(LINE_BREAK);
      }
    });

    return outputValue;
  
  }
 
  this.visualize = function() {
    document.getElementById("visualize-field").value = stripText( newVal => indexText(newVal).concat(LINE_BREAK));
  }

  this.filterText = function() {

    let filterValues = document.getElementById("filter-field").value.split(LINE_BREAK);

    let finalOutput = "";
    let output = stripText( newVal => {
      
      let retVal = "";
      _.forEach( filterValues, (value, key) => {
        let splitValue = value.split(FILTER_SEPARATOR_ADD_SPACE);
        let addFirstBreak = true;
        if(splitValue.length <= 1) {
          addFirstBreak = false;
          splitValue = value.split(FILTER_SEPARATOR);
        }

        let filterKey = splitValue[0] || "";
        if( (newVal || "").includes(filterKey) && !!splitValue[1]) {

          let splitNewVal = newVal.split(REPLACE_VAL);
          let outputValue = splitValue[1];

          _.forEach(splitNewVal, (val, idx) => {
            outputValue = searchAndReplaceText(outputValue, `{${idx}}`, val);
          });
          if(addFirstBreak) {
            outputValue = LINE_BREAK.concat(outputValue);
          }
          retVal = retVal.concat(outputValue).concat(LINE_BREAK);
          //exit loop
          return;
        } 
      });
      return retVal;

    });
    finalOutput = finalOutput.concat(output).concat(LINE_BREAK);

    document.getElementById("output-field").value = finalOutput;
    
  }

});