(function ($) {
  
  "use strict";

    // PRE LOADER
    $(window).on("load", function(){
      $('.preloader').fadeOut(1000);
    });
    
    // CUSTOM LINK
    $('.custom-link').click(function(){
    var el = $(this).attr('href');
    var elWrapped = $(el);
    var header_height = $('.navbar').height() + 10;

    scrollToDiv(elWrapped,header_height);
    return false;

    function scrollToDiv(element,navheight){
      var offset = element.offset();
      var offsetTop = offset.top;
      var totalScroll = offsetTop-navheight;

      $('body,html').animate({
      scrollTop: totalScroll
      }, 300);
  }
});
    
  })(window.jQuery);

// validate form before submission
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".contact-form");
  
  if (form) {
      form.addEventListener("submit", function (e) {
          e.preventDefault(); // Prevent default form submission

          const name = document.querySelector("#name").value.trim();
          const email = document.querySelector("#email").value.trim();
          const message = document.querySelector("#message").value.trim();

          if (name === "" || email === "" || message === "") {
              alert("Please fill in all fields.");
              return;
          }

          if (!validateEmail(email)) {
              alert("Please enter a valid email address.");
              return;
          }

          // Send data to backend
          sendFormData({ name, email, message });
      });
  }
});

// Email validation function
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return re.test(email);
}

// Send form data to backend
function sendFormData(formData) {
  fetch("http://localhost:5000/send-email", {  // <-- Make sure it's correct
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
})
.then(async response => {
    if (!response.ok) {
        const text = await response.text();
        throw new Error("Server Error: " + text);
    }
    return response.json();
})
.then(data => {
    alert("Message sent successfully!");
    document.querySelector(".contact-form").reset();
})
.catch(error => console.error("Fetch error:", error));

}

// skills
document.addEventListener("DOMContentLoaded", function () {
  const progressBars = document.querySelectorAll(".progress");
  
  function animateBars() {
      progressBars.forEach((bar) => {
          const width = bar.style.getPropertyValue("--width"); // Get width from CSS variable
          bar.style.width = "0"; // Reset width for animation
          setTimeout(() => {
              bar.style.width = width;
          }, 500); // Delay animation slightly for effect
      });
  }

  // Trigger animation when the skills section is in view
  const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              animateBars();
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0.5 });

  observer.observe(document.getElementById("skills"));
});
