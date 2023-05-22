  let editButton = document.querySelector('.btn-primary')

  editButton.addEventListener('click', function(){
    console.log('working')
    const description = document.querySelector('#description').value
    const notes = document.querySelector('#notes').value
    const category = document.querySelector('#category').value
    const date = document.querySelector('#date').value
    const postId = document.querySelector('#postId').value
    fetch('/updatePost', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'postId': postId,
        'description': description,
        'notes': notes,
        'category':category,
        'date': date
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.replace('/profile')
    })
  });
