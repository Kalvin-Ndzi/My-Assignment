//i'm using this function to dynamically highlight the page that i am currently on
function highlightActiveLink() {
  //i will get the current page pathname, get the html file name and convert it to lowercase for uniorm comparison
  const currentPage = window.location.pathname.split("/").pop().toLowerCase();

  //get all the links in my nav menu
  document.querySelectorAll('.nav-link').forEach((link) => {
    //get the page for comparison
    const linkPage = new URL(link.href).pathname.split("/").pop().toLowerCase();

    // Reset all links
    link.classList.remove('active');

    // Apply active only to exact match
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
}

//i am using this function to dynamically load the footer and header from the footer and header files
function loadHTML(selector, file, callback) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.querySelector(selector).innerHTML = data;

            // Check if the header is being loaded properly
            if (file.includes('header')) {
                const toggle = document.getElementById('menu-toggle');
                if (toggle) {
                    toggle.onclick = function () {
                        document.querySelector('.nav-links').classList.toggle('active');
                    };
                }
            }
            if(callback && typeof callback === 'function') {
                callback();
            }
        });
}

window.addEventListener('DOMContentLoaded', () => {
    loadHTML('#header', '../html/header.html',highlightActiveLink);
    loadHTML('#footer', '../html/footer.html');
});

