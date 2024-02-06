function myFunction(x) {
  var displayElement = document.getElementById('displayComments'); // Get the display element
  x.classList.toggle("fa-thumbs-down");
  if(x.classList.contains("fa-thumbs-down")){
      displayElement.textContent = '1'; // Display '0'
  }
  else{
      displayElement.textContent = '0'; // Display '1'
  }
}