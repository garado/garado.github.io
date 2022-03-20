function toggleMobileNavbar( ) {
    var navlinkCont = document.getElementById("navlink-cont");
    if (navlinkCont.classList.contains("isOpen")) {
      navlinkCont.classList.remove("isOpen");
      navlinkCont.classList.add("isClosed");
    } else {
      navlinkCont.classList.add("isOpen");
      navlinkCont.classList.remove("isClosed");
    }
  }