document.addEventListener('DOMContentLoaded', () => {

  /** 
    Fetch Functions
  */

  let employees;

  fetch('https://randomuser.me/api/1.2/?format=json&results=12&nat=au,gb,nz,us')
    .then(checkStatus)
    .then(res => res.json())
    .then(data => {
      employees = data.results;
      createEmployeeCards();
    })
    .catch(error => console.log('looks like there was a problem', error)
  );

  /** 
    Helper Functions
  */
  function checkStatus(response) {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  function getCountry(employeeCountry) {
    const countryArray = [
      {
        abbr: "AU",
        country: "Australia"
      },
      {
        abbr: "GB",
        country: "United Kingdom"
      },
      {
        abbr: "NZ",
        country: "New Zealand"
      },
      {
        abbr: "US",
        country: "United States"
      }
    ];

    return countryArray.find(country => employeeCountry === country.abbr).country;
    
  }

  // https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript

  function formatPhoneNumber(phoneNumberString) {
    if (phoneNumberString.charAt(4) === "-" || phoneNumberString.charAt(4) === ")") {
      var cleaned = (phoneNumberString).replace(/\D/g, '')
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
      if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
      }
    }
    return phoneNumberString;
  }

  function formatBirthday(birthday) {
    birthday = new Date(birthday);

    return (birthday.getMonth() + 1) + "/" + birthday.getDate() + "/" + birthday.getFullYear();
  }

  function createEmployeeCards() {
    const galleryDiv = document.getElementById('gallery');

    galleryDiv.innerHTML = '';

    employees.forEach(employee => {
      let country = getCountry(employee.nat);
      const employeeCard = `
        <div class="card">
          <div class="card-img-container">
              <img class="card-img" src="${employee.picture.medium}" alt="profile picture">
          </div>
          <div class="card-info-container">
              <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
              <p class="card-text">${employee.email}</p>
              <p class="card-text cap">${employee.location.city}, ${country}</p>
          </div>
        </div>
      `
      galleryDiv.innerHTML += employeeCard;
    });

    createModalContainer();
  }

  function createModalContainer() {
    const body = document.querySelector('body');
    const galleryNextSibling = document.getElementById('gallery').nextElementSibling;

    //add outer container
    const modalContainer = document.createElement("DIV");
    modalContainer.classList.add('modal-container');
    body.insertBefore(modalContainer, galleryNextSibling);

    //add modal container
    modal = document.createElement("DIV");
    modal.classList.add("modal");
    modalContainer.appendChild(modal);

    //add button
    modal.innerHTML = '<button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>';

    //add info container
    const info = document.createElement("DIV");
    info.classList.add("modal-info-container")
    modal.appendChild(info);
  }





    // <div class="modal-container">
    // <div class="modal">
    //     <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
    //     <div class="modal-info-container">
    //         <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
    //         <h3 id="name" class="modal-name cap">name</h3>
    //         <p class="modal-text">email</p>
    //         <p class="modal-text cap">city</p>
    //         <hr>
    //         <p class="modal-text">(555) 555-5555</p>
    //         <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
    //         <p class="modal-text">Birthday: 10/21/2015</p>
    //     </div>
    // </div>

    // // IMPORTANT: Below is only for exceeds tasks 
    // <div class="modal-btn-container">
    //     <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
    //     <button type="button" id="modal-next" class="modal-next btn">Next</button>
    // </div>
//</div>

  function addModalInfo(employee) {
    console.log(employee);
    const infoContainer = document.getElementsByClassName("modal-info-container")[0];

    const employeeInfo = `
      <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
      <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
      <p class="modal-text">${employee.email}</p>
      <p class="modal-text cap">${employee.location.city}</p>
      <hr />
      <p class="modal-text">${formatPhoneNumber(employee.phone)}</p>
      <p class="modal-text cap">${employee.location.street}</p>
      <p class="modal-text cap">${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
      <p class="modal-text cap">${getCountry(employee.nat)}</p>
      <p class="modal-text">Birthday: ${formatBirthday(employee.dob.date)}</p>
    `;
     infoContainer.innerHTML = employeeInfo;
  }

  document.addEventListener('click', e => {
    //close button on modal click
    if ((e.target.parentNode.className === "modal-close-btn") || (e.target.className === 'modal-close-btn')) {
      document.getElementsByClassName('modal-container')[0].style.display = "none"; 
    //open modal when employee card is clicked  
    } else if (e.target.className.includes("card")) {
      const cardDiv = e.path.find(pathObject => pathObject.className === 'card');
      const targetEmail = cardDiv.lastElementChild.firstElementChild.nextElementSibling.textContent;
      const targetEmployee = employees.find(employee => employee.email === targetEmail);
      addModalInfo(targetEmployee);

      document.getElementsByClassName('modal-container')[0].style.display = "block"; 
    }

  });

}); //content loaded