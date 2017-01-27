function printName() {
  console.log(' ____   __   ____  ____  _  _      ____  ____  __  ____  ____ '.magenta);
  console.log('/ ___) / _\\ / ___)/ ___)( \\/ )___ / ___)(_  _)/ _\\(_  _)/ ___)'.magenta);
  console.log('\\___ \\/    \\\\___ \\\\___ \\ )  /(___)\\___ \\  )( /    \\ )(  \\___ \\'.magenta);
  console.log('(____/\\_/\\_/(____/(____/(__/      (____/ (__)\\_/\\_/(__) (____/'.magenta);
}

function getSpaces(str) {
  var result = '';

  for(var i = 0; i < 40 - str.length; i++) {
    result += ' ';
  }

  return result;
}

function printLine(count) {
  var keyStr = count.key.trim() + ':';
  console.log(keyStr.yellow + getSpaces(keyStr) + count.val.toString().red);
}

var makePrintList = function(data) {
  return function printList(key) {
    console.log(key.toUpperCase().green);
    console.log('----------------------------'.green);

    var stats = data[key];
    var counts = countsToArray(stats);
    var total = counts.pop();

    counts.forEach(printLine);
    console.log('');
    printLine(total);
    console.log('');
  };
};

// {}->[{}]
function countsToArray(obj) {
  var result = Object.keys(obj)
    .reduce(countsToObjects(obj), [])
    .sort(sortByVal)
    .concat([]);

  result.push(getTotal(obj));
  return result;
}

function sortByVal(a, b) {
  return b.val - a.val;
}

function countsToObjects(obj) {
  return function(acc, key) {
    acc.push({ key: key, val: obj[key] });
    return acc;
  };
}

function getTotal(obj) {
  return Object.keys(obj)
    .reduce(function(acc, key) {

      acc.val += obj[key];
      return acc;

    }, {key: 'total', val: 0});
}

function printTotalFilesWalked(files) {
  var text = 'total .scss files:';
  console.log(text.yellow + getSpaces(text) + files.count.toString().red);
}

function printFiles(files) {
  console.log('FILES'.green);
  console.log('----------------------------'.green);
  printTotalFilesWalked(files);
  console.log('');
}

module.exports = {
  printFiles: printFiles,
  printName: printName,
  getSpaces: getSpaces,
  printLine: printLine,
  makePrintList: makePrintList
};
