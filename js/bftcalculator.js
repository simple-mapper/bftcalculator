var bftcalculator = {
  init: () => {
    bftcalculator.form();
  },
  gen: (txt, id) => {
    document.getElementById("bftform").innerHTML = txt;
    bftcalculator.set(id);
  },
  form: () => {

    var id = "1";

    var txt = `
    <h3>Summary</h3>
    <p id="bft-${id}">value</p>
    <h3>Inputs <span class="smalltext">(All Required)</span></h3>
    <form id="bftform-${id}">
    <label for="thickness">Thickness(in)</label><br>
    <input type="number" id="thickness-${id}" name="thickness"><br>
    <label for="width">Width (in)</label><br>
    <input type="number" id="width-${id}" name="width"><br>
    <label for="length">Length (ft)</label><br>
    <input type="number" id="length-${id}" name="length">
    </form>
    <h3>Price <span class="smalltext">(One Required)</span></h3>
    <form id="bftpriceform-${id}">
    <label for="each">Each ($)</label><br>
    <input type="number" id="each-${id}" name="each"><br>
    <label for="mbft">mbft ($)</label><br>
    <input type="number" id="mbft-${id}" name="mbft"><br>
    </form>
    <h3>Description <span class="smalltext">(optional)</span></h3>
    <form id="bftdescform-${id}">
    <label for="type">Type</label>
    <br>
    <select name="type" id="type-${id}" form="bftdescform-${id}">
    <option value="blank">blank</option>
    <option value="SYP">SYP - Southern Yellow Pine</option>
    <option value="SPF">SPF - Spruce, Pine & Fir</option>
    <option value="HW">HW - Hardwood</option>
    <option value="SW">SW - Softwood</option>
    </select>
    </br>
    <label for="other">Other</label><br>
    <input type="text" id="other-${id}" name="other"><br>
    </form>
    <br>
    `;

    bftcalculator.gen(txt, id);

  },
  set: (id) => {

    document.getElementById(`bftform-${id}`).addEventListener('change', function() {
      bftcalculator.update(this.elements, id);
    });

    document.getElementById(`bftpriceform-${id}`).addEventListener('change', function() {
      bftcalculator.updatePrice(this.elements, id);
    });

    document.getElementById(`bftdescform-${id}`).addEventListener('change', function() {
      bftcalculator.updateDesc(this.elements, id);
    });

  },
  bft: 0,
  specs: {},
  cal: {},
  desc: {},
  update: (el, id) => {

    var obj ={};
    var check = true;
    for(var i = 0 ; i < el.length ; i++){
      var item = el.item(i);
      obj[item.name] = item.value;
      if(!item.value) {
        check = false;
      }
    }

    if(check){
      var num = (obj.thickness*obj.width*obj.length)/12;
      bftcalculator.bft = num;
      bftcalculator.specs = obj;

      let element = document.getElementById(`bftpriceform-${id}`);
      element.dispatchEvent(new Event("change"));

      bftcalculator.setSummary(id);

    }
    else {
      var num = 0;
      var val = bftcalculator.round(num);
      bftcalculator.bft = num;
      bftcalculator.specs = obj;

      document.getElementById(`bft-${id}`).innerHTML = 'value';
    }

  },
  updatePrice: (el, id) => {

    var obj ={};
    var count = 0;
    var keySave = "";
    for(var i = 0 ; i < el.length ; i++){
      var item = el.item(i);
      obj[item.name] = parseFloat(item.value);
      if(obj[item.name] > 0) {
        count++;
        keySave = item.name;
      }
    }

    var cal = {
      each: 0,
      mbft: 0
    }

    if(count > 0 && bftcalculator.bft > 0){
      if(keySave == "each"){
        cal.each = obj[keySave];
        cal.mbft = bftcalculator.calPricembft(cal.each, bftcalculator.bft);
      }
      else{
        cal.mbft = obj[keySave];
        cal.each = bftcalculator.calPriceEach(cal.mbft, bftcalculator.bft);
      }

      bftcalculator.cal = cal;
      bftcalculator.setSummary(id);
    }

  },
  updateDesc: (el, id) => {

    var obj ={};
    var count = 0;
    var keySave = "";
    for(var i = 0 ; i < el.length ; i++){
      var item = el.item(i);
      obj[item.name] = item.value;
      if(obj[item.name] > 0) {
        count++;
      }
    }

    //type & other

    if(bftcalculator.bft > 0){
      bftcalculator.desc = obj;
      bftcalculator.setSummary(id);
    }


  },
  calPricembft: (each, bft) => {

    var mult = 1000/bft;
    var val = mult*each;

    return val;

  },
  calPriceEach: (mbft, bft) => {

    var mult = 1000/bft;
    var val = mbft/mult;

    return val;

  },
  setSummary: (id) => {

    var bft = bftcalculator.round(bftcalculator.bft);
    var EAs = bftcalculator.round(1000/bftcalculator.bft);
    var specs = bftcalculator.specs;
    var cal = bftcalculator.cal;
    var desc = bftcalculator.desc;

    var txt = `${specs.thickness}"x${specs.width}"x${specs.length}'`;

    txt = txt + `, ${bft} bft, ${EAs} EA/m`;

    if(cal.each != undefined){
      txt = txt + `, $${bftcalculator.round(cal.each)} EA, $${bftcalculator.round(cal.mbft)} mbft`;
    }

    var str = "";

    if(desc.type != undefined && desc.type != "blank"){
      if (desc.other) {
        str = `${desc.type}, ${desc.other}, `;
      }
      else {
        str = `${desc.type}, `;
      }
      txt = str + txt;
    }
    else if (desc.type != undefined) {
      if (desc.other) {
        str = `${desc.other}, `;
      }
      txt = str + txt;
    }

    //specs

    document.getElementById(`bft-${id}`).innerHTML = txt;

  },
  round: (num) => {
    var val = Math.round((num + Number.EPSILON) * 100)/100;
    return val;
  }

};

bftcalculator.init();
