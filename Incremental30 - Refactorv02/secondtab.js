function openSecondTab(evt, tabName) {
    // Declare all variables
    var i, secondtabcontent, secondtablinks;
  
    // Get all elements with class="secondtabcontent" and hide them
    secondtabcontent = document.getElementsByClassName("secondtabcontent");
    for (i = 0; i < secondtabcontent.length; i++) {
      secondtabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="secondtablinks" and remove the class "active"
    secondtablinks = document.getElementsByClassName("secondtablinks");
    for (i = 0; i < secondtablinks.length; i++) {
      secondtablinks[i].className = secondtablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }