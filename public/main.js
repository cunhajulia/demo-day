// Get references to the HTML elements
const kitNumberInput = document.getElementById('kitNumber');
const statusUpdate = document.getElementById('statusUpdate');
const statusHistoryTracker = document.getElementById('statusHistoryTracker');
const submitButton = document.getElementById('clickMe');





// const barcodes = [
//   { barcode: 'SAECK12345', status: 'in storage' },
//   { barcode: 'SAECK67890', status: 'tested' },
//   { barcode: 'SAECK24680', status: 'en route to storage' },
//   { barcode: 'SAECK13579', status: 'status unknown' },
//   { barcode: 'SAECK11223', status: 'tested' },
//   { barcode: 'SAECK33445', status: 'in storage' },
//   { barcode: 'SAECK55667', status: 'not tested' },
//   { barcode: 'SAECK77889', status: 'not tested' },
//   { barcode: 'SAECK89012', status: 'en route to storage' },
//   { barcode: 'SAECK12344', status: 'tested' },
//   { barcode: 'SAECK67895', status: 'in storage' },
//   { barcode: 'SAECK24685', status: 'status unknown' },
//   { barcode: 'SAECK13575', status: 'not tested' },
//   { barcode: 'SAECK11228', status: 'en route to storage' },
//   { barcode: 'SAECK33440', status: 'tested' },
//   { barcode: 'SAECK55662', status: 'in storage' },
//   { barcode: 'SAECK77883', status: 'not tested' },
//   { barcode: 'SAECK89016', status: 'tested' },
//   { barcode: 'SAECK12347', status: 'en route to storage' },
//   { barcode: 'SAECK67898', status: 'not tested' },
//   { barcode: "SAECK12345", status: "in storage" },
//   { barcode: "SAECK23456", status: "en route to storage" },
//   { barcode: "SAECK34567", status: "tested" },
//   { barcode: "SAECK45678", status: "status unknown" },
//   { barcode: "SAECK56789", status: "tested" },
//   { barcode: "SAECK67890", status: "in storage" },
//   { barcode: "SAECK78901", status: "tested" },
//   { barcode: "SAECK89012", status: "en route to storage" },
//   { barcode: "SAECK90123", status: "status unknown" },
//   { barcode: "SAECK01234", status: "tested" },
//   { barcode: "SAECK98765", status: "en route to storage" },
//   { barcode: "SAECK87654", status: "tested" },
//   { barcode: "SAECK76543", status: "in storage" },
//   { barcode: "SAECK65432", status: "not tested" },
//   { barcode: "SAECK54321", status: "not tested" },
//   { barcode: "SAECK43210", status: "en route to storage" },
//   { barcode: "SAECK24680", status: "status unknown" },
//   { barcode: "SAECK13579", status: "not tested" },
//   { barcode: "SAECK55555", status: "tested" },
//   { barcode: "SAECK44444", status: "in storage" }
// ];


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

//profile edit and delete functions

const editButtons = document.querySelectorAll('.fa-pen-to-square');
const deleteButtons = document.querySelectorAll('.fa-trash');

editButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    const entryId = this.dataset.entryid;
    // Redirect to the edit page or perform any other action you need
    window.location.href = `/editPost/${entryId}`;
  });
});


deleteButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    const entryId = this.dataset.entryid;

    fetch(`/deletePost/${entryId}`, {
      method: 'DELETE',
    })
      .then(function (response) {
        if (response.ok) {
          window.location.reload();
        } else {
          console.error('Error deleting post.');
        }
      })
      .catch(function (error) {
        console.error('Error deleting post:', error);
      });
  });
});

// ____________________________________________________________________

// Define the barcodes array
const barcodes = [
  { barcode: 'SAECK12345', status: 'in storage', history: [] },
  { barcode: 'SAECK67890', status: 'tested', history: [] },
  { barcode: 'SAECK24680', status: 'en route to storage', history: [] },
  { barcode: 'SAECK13579', status: 'status unknown', history: [] },
  { barcode: 'SAECK11223', status: 'tested', history: [] },
  { barcode: 'SAECK33445', status: 'in storage', history: [] },
  { barcode: 'SAECK55667', status: 'not tested', history: [] },
  { barcode: 'SAECK77889', status: 'not tested', history: [] },
  { barcode: 'SAECK89012', status: 'en route to storage', history: [] },
  { barcode: 'SAECK12344', status: 'tested', history: [] },
  { barcode: 'SAECK67895', status: 'in storage', history: [] },
  { barcode: 'SAECK24685', status: 'status unknown', history: [] },
  { barcode: 'SAECK13575', status: 'not tested', history: [] },
  { barcode: 'SAECK11228', status: 'en route to storage', history: [] },
  { barcode: 'SAECK33440', status: 'tested', history: [] },
  { barcode: 'SAECK55662', status: 'in storage', history: [] },
  { barcode: 'SAECK77883', status: 'not tested', history: [] },
  { barcode: 'SAECK89016', status: 'tested', history: [] },
  { barcode: 'SAECK12347', status: 'en route to storage', history: [] },
  { barcode: 'SAECK67898', status: 'not tested', history: [] },
  { barcode: "SAECK12345", status: "in storage", history: [] },
  { barcode: "SAECK23456", status: "en route to storage", history: [] },
  { barcode: "SAECK34567", status: "tested", history: [] },
  { barcode: "SAECK45678", status: "status unknown", history: [] },
  { barcode: "SAECK56789", status: "tested", history: [] },
  { barcode: "SAECK67890", status: "in storage", history: [] },
  { barcode: "SAECK78901", status: "tested", history: [] },
  { barcode: "SAECK89012", status: "en route to storage", history: [] },
  { barcode: "SAECK90123", status: "status unknown", history: [] },
  { barcode: "SAECK01234", status: "tested", history: [] },
  { barcode: "SAECK98765", status: "en route to storage", history: [] },
  { barcode: "SAECK87654", status: "tested", history: [] },
  { barcode: "SAECK76543", status: "in storage", history: [] },
  { barcode: "SAECK65432", status: "not tested", history: [] },
  { barcode: "SAECK54321", status: "not tested", history: [] },
  { barcode: "SAECK43210", status: "en route to storage", history: [] },
  { barcode: "SAECK24680", status: "status unknown", history: [] },
  { barcode: "SAECK13579", status: "not tested", history: [] },
  { barcode: "SAECK55555", status: "tested", history: [] },
  { barcode: "SAECK44444", status: "in storage", history: [] }
];

// Add an event listener to the submit button
submitButton.addEventListener('click', () => {
  const kitNumber = kitNumberInput.value.trim(); // Get the input value and trim any whitespace

  // Find the barcode object with the matching kitNumber



  // Update the status and history elements with the retrieved data


  // Statuses of kits
  let statusArr = ['status unknown', 'en route to storage', 'in storage', 'not tested', 'tested',]
  let firstDate = document.querySelector('.firstDate').innerText === '' ? new Date() : new Date(document.querySelector('.firstDate').innerText)
  console.log(firstDate)
  const currentDate = new Date()

  let status

  // Gets difference of days between first date submitted and current date
  let diff = Math.abs(firstDate.getTime() - currentDate.getTime());
  diff = diff / (1000 * 60 * 60 * 24);

  console.log(diff)

  // Checks difference of days and reassigns status
  if (diff >= 40) {
    status = statusArr[4]
  } else if (diff >= 30) {
    status = statusArr[3]
  } else if (diff >= 20) {
    status = statusArr[2]
  } else if (diff >= 10) {
    status = statusArr[1]
  } else if (diff >= 0) {
    status = statusArr[0]
  }

  console.log(status)


  fetch('storeStatus', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'status': status,
      'date': currentDate.toLocaleDateString(),
      'kitNumber': kitNumber
    })
  })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })

  kitNumberInput.value = '';

});




// const getBarcode = document.getElementById('needBarcode');
// for (i = 0; i < barcodes.length; i++) {
//  let option = document.createElement('option')
//  option.innerText = barcodes[i].barcode
//  getBarcode.appendChild(option)
// }
