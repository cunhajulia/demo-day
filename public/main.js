// assume the status update is retrieved and stored in a variable called "update"
// document.getElementById("status-update").textContent = update;

const barcodes = [
  { barcode: 'SAECK12345', status: 'in storage' },
  { barcode: 'SAECK67890', status: 'tested' },
  { barcode: 'SAECK24680', status: 'en route to storage' },
  { barcode: 'SAECK13579', status: 'status unknown' },
  { barcode: 'SAECK11223', status: 'tested' },
  { barcode: 'SAECK33445', status: 'in storage' },
  { barcode: 'SAECK55667', status: 'not tested' },
  { barcode: 'SAECK77889', status: 'not tested' },
  { barcode: 'SAECK89012', status: 'en route to storage' },
  { barcode: 'SAECK12344', status: 'tested' },
  { barcode: 'SAECK67895', status: 'in storage' },
  { barcode: 'SAECK24685', status: 'status unknown' },
  { barcode: 'SAECK13575', status: 'not tested' },
  { barcode: 'SAECK11228', status: 'en route to storage' },
  { barcode: 'SAECK33440', status: 'tested' },
  { barcode: 'SAECK55662', status: 'in storage' },
  { barcode: 'SAECK77883', status: 'not tested' },
  { barcode: 'SAECK89016', status: 'tested' },
  { barcode: 'SAECK12347', status: 'en route to storage' },
  { barcode: 'SAECK67898', status: 'not tested' },
  { barcode: "SAECK12345", status: "in storage" },
  { barcode: "SAECK23456", status: "en route to storage" },
  { barcode: "SAECK34567", status: "tested" },
  { barcode: "SAECK45678", status: "status unknown" },
  { barcode: "SAECK56789", status: "tested" },
  { barcode: "SAECK67890", status: "in storage" },
  { barcode: "SAECK78901", status: "tested" },
  { barcode: "SAECK89012", status: "en route to storage" },
  { barcode: "SAECK90123", status: "status unknown" },
  { barcode: "SAECK01234", status: "tested" },
  { barcode: "SAECK98765", status: "en route to storage" },
  { barcode: "SAECK87654", status: "tested" },
  { barcode: "SAECK76543", status: "in storage" },
  { barcode: "SAECK65432", status: "not tested" },
  { barcode: "SAECK54321", status: "not tested" },
  { barcode: "SAECK43210", status: "en route to storage" },
  { barcode: "SAECK24680", status: "status unknown" },
  { barcode: "SAECK13579", status: "not tested" },
  { barcode: "SAECK55555", status: "tested" },
  { barcode: "SAECK44444", status: "in storage" }
];

// profile timeline ----------------
// VARIABLES
const elH = document.querySelectorAll(".timeline li > div");

// START
window.addEventListener("load", init);

function init() {
  setEqualHeights(elH);
}

// SET EQUAL HEIGHTS
function setEqualHeights(el) {
  let counter = 0;
  for (let i = 0; i < el.length; i++) {
    const singleHeight = el[i].offsetHeight;

    if (counter < singleHeight) {
      counter = singleHeight;
    }
  }

  for (let i = 0; i < el.length; i++) {
    el[i].style.height = `${counter}px`;
  }
}
// ------------------------------------------------

























// profile tabs for contact info, docs and notes 
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// hospital api _____________________________________________________

// document.querySelector('button').addEventListener('click', getHospital)

// function getHospital(){ //do i want to filter thru this api at all? or discard?
//   let city = document.querySelector('.city').value
//   let state = document.querySelector('.state').value
//   const hospital = document.querySelector('.hospitals') 
//   fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.communitybenefitinsight.org/api/get_hospitals.php?state=${state}&city=${city}&fields=hospital_name,address`)}`)
//   .then(res => res.json())
//   .then(data => {
//     console.log(data.contents)
  
//   })
//   .catch(err => {
//     console.log(`error ${err}`)
//   });
// }

// _________________________________________________________

Array.from(trash).forEach(function(element) { //modify this - maybe for deleting notes, docs, or images?
  element.addEventListener('click', function(){
    const entry = this.parentNode.parentNode.childNodes[1].innerText
    fetch('/journal',{
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'entryID': element.dataset.entryid
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});

// ____________________________________________________________________