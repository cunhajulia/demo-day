var favorite = document.getElementsByClassName("fa-star");
var trash = document.getElementsByClassName("fa-trash");

Array.from(favorite).forEach(function(element) {
      element.addEventListener('click', function(){
        console.log(element.dataset.entryid)
        fetch('/journal', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'entryID': element.dataset.entryid //line 30 in ejs
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function(element) {
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

