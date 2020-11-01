//selectors:
var previous20 = document.getElementById('button-start');
var sidebar = document.getElementById('sidebar');
var previousButton = document.getElementById('button-previous');
var select = document.getElementById('select-title');
var nextButton = document.getElementById('button-next');
var min = document.getElementById('min');
var range = document.getElementById('range');
var sidebarBtn = document.getElementById('collapse-button');
var next20 = document.getElementById('button-end');

//vars:
var title = "";
var atleast3 = false;
var accuracy = 0.5;
var text = "";
var arrayObject = [];
var currentLead = 0;
var arrayData = [];
var arrayS_Og = [];
var offset = 20;
var arrayOg = [];
var arrayS_rec = [];

previous20.addEventListener('click', function() {
  /*if ((currentLead - 20) < 0){
    currentLead = arrayData.length - 20;
  } else {
    currentLead -= - 20;
  }
  getData();*/
  currentLead = currentLead - 20;
  if(currentLead < 0) {
    currentLead = arrayData.length - 20;
  }
  getData();
})

previousButton.addEventListener('click', function() {
  currentLead = currentLead - 1;
  if(currentLead < 0) {
    currentLead = arrayData.length - 20;
  }
  getData();
})

nextButton.addEventListener('click', function() {
  console.log(currentLead);
  console.log(arrayData.length);
  currentLead = currentLead + 20;
  if(currentLead + offset >= arrayData.length) {
    currentLead = 0;
  }
  getData();
})

next20.addEventListener('click', function() {
  currentLead = arrayData.length - 20;
  getData();
})

min.addEventListener('change', function() {
  atleast3 = !atleast3;
  addlabel("original-labels", arrayOg);
  addlabel("recommended-labels", arrayObject);
  addlabel("recommended-spec-labels", arrayS_rec);
  addlabel("original-spec-labels", arrayS_Og);
});

(function () {
  getData();
  accuracy = range.value;
  document.getElementById('range-value').textContent = range.value;
})();

sidebarBtn.addEventListener('click', function() {
  sidebar.classList.toggle('active');
});

range.addEventListener('input', function(e) {
  accuracy = e.target.value;
  document.getElementById('range-value').textContent = e.target.value;
  addlabel("original-labels", arrayOg);
  addlabel("recommended-labels", arrayObject);
  addlabel("recommended-spec-labels", arrayS_rec);
  addlabel("original-spec-labels", arrayS_Og);
});

function getData(url = 'data.txt') {
  arrayData = [];
  fetch(url)
    .then((response) => response.text())
    .then((text) => text.split('\n'))
    .then((text) => text.map((line) => line.split('$$$')))
    .then((text) => {
      var obj = {};
      var indx = 0;
      text.forEach((line) => {
        obj.recommended = line[0];
        obj.recommendedSpec = line[1];
        obj.original = line[2];
        obj.title = line[3];
        obj.text = line[4];
        obj.id = indx++;

        arrayData.push(obj);
        obj = {};
      });
      select.innerHTML = "";

      arrayData.map((data, index) => {
        if(index >= currentLead && index < (currentLead + offset)) {
          var option = document.createElement('option');
          option.innerText = data.title;
          option.value = data.title;
          select.appendChild(option);
        }
      });
    });
};

select.addEventListener('change', function(e) {
  var option = arrayData.find(d => d.title == e.target.value);
  console.log()
  getDataFromText(option);
});

var getDataFromText = function(data) {
  arrayObject = [];
  arrayS_rec = [];
  arrayOg = [];
  arrayS_Og = [];
  var tempObj = {};
  console.log(data);
  var recommended = data.recommended.split(' '); 
  var recommendedSpec = data.recommendedSpec.split(' '); 
  var original = data.original.split(' ');
  text = data.text;
  title = data.title;
  
  recommended.forEach(item => {
    if(item.trim().startsWith('__label__')) {
      tempObj.label = item.replace("__label__", "").replace(/@{2}/g, " ");
    }else if(item != "") {
      tempObj.accuracy = item.trim();
      arrayObject.push(tempObj);
      tempObj = {};
    }
  });

  recommendedSpec.forEach(item => {
    if(item.trim().startsWith('__label__')) {
      tempObj.label = item.replace("__label__", "").replace(/@{2}/g, " ");
    }else if(item != "") {
      tempObj.accuracy = item.trim();
      arrayS_rec.push(tempObj);
      tempObj = {};
    }
  });
  original.forEach(item => {
    if(item.trim().startsWith('__label__')) {
      tempObj.label = item.replace("__label__", "").replace(/@{2}/g, " ");
      arrayOg.push(tempObj);
      tempObj = {};
    }else if(item != "") {
      tempObj.label = item.replace(/@{2}/g, " ");
      arrayS_Og.push(tempObj);
      tempObj = {};
    }
  });

  var elem = document.getElementById("text-content");
  elem.innerHTML = text;
  
  addlabel("original-labels", arrayOg);
  addlabel("recommended-labels", arrayObject);
  addlabel("recommended-spec-labels", arrayS_rec);
  addlabel("original-spec-labels", arrayS_Og);
}





var addlabel = function(nodeId, data = []) {
  console.log(data);
  var node = document.getElementById(nodeId);
  node.innerHTML = "";
  if(atleast3) {
    for(var i = 0; i < data.length && i < 3; i++) {
      var list = document.createElement('li');
        if (data[i].accuracy !== undefined) {
          list.textContent = `${data[i].label} ${data[i].accuracy}`;
        }else {
          list.textContent = data[i].label;
        }
        /*
        for(var i = 0; i < data.length && i < data.length; i++) {
      var list = document.createElement('li');
        if (data[i].accuracy !== undefined) {
          list.textContent = `${data[i].label} ${data[i].accuracy}`;
        }else {
          list.textContent = data[i].label;
        }*/
        node.appendChild(list);
    }




    for(var i = 3; i < data.length; i++) {
      if(data[i].accuracy !== undefined) {
        if(data[i].accuracy >= accuracy) {
          var list = document.createElement('li');
          if (data[i].accuracy !== undefined) {
            list.textContent = `${data[i].label} ${data[i].accuracy}`;
          }else {
            list.textContent = data[i].label;
          }
          node.appendChild(list);
        }
      } else {
        var list = document.createElement('li');
        if (data[i].accuracy !== undefined) {
          list.textContent = `${data[i].label} ${data[i].accuracy}`;
        }else {
          list.textContent = data[i].label;
        }
        node.appendChild(list);
      }
    }
  } else {
    for(var i = 0; i < data.length; i++) {
      if(data[i].accuracy !== undefined) {
        if(data[i].accuracy >= accuracy) {
          var list = document.createElement('li');
          if (data[i].accuracy !== undefined) {
            list.textContent = `${data[i].label} ${data[i].accuracy}`;
          }else {
            list.textContent = data[i].label;
          }
          node.appendChild(list);
        }
      } else {
        var list = document.createElement('li');
        if (data[i].accuracy !== undefined) {
          list.textContent = `${data[i].label} ${data[i].accuracy}`;
        }else {
          list.textContent = data[i].label;
        }
        node.appendChild(list);
      }
    }
  }
};