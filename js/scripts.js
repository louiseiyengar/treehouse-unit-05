document.addEventListener('DOMContentLoaded', () => {

  /** 
   * CLOBAL CONSTANTS
  */
  let employees = new Array();
  let searchEmployees = new Array();
 
  /** 
    FETCH PROMISE
  */
  fetch('https://randomuser.me/api/1.2/?format=json&results=12&nat=au,gb,nz,us')
    .then(checkStatus)
    .then(res => res.json())
    .then(data => {
      employees = data.results;
      createEmployeeCards(employees);
      createModalContainer();
      createSearchForm();
    })
    .catch(error => console.log('looks like there was a problem', error)
  );  //end fetch

  /** 
    EVENT LISTENERS
  */
  document.addEventListener('click', e => {
    //close button on modal
    if ((e.target.parentNode.className === "modal-close-btn") || (e.target.className === 'modal-close-btn')) {
      document.getElementsByClassName('modal-container')[0].style.display = "none"; 
      if (searchEmployees.length) {
        document.getElementById('search-input').value = '';
        createEmployeeCards(employees);
        searchEmployees = [];
      }

    //open modal when employee card is clicked  
    } else if (e.target.className.includes("card")) {
      const cardDiv = e.path.find(pathObject => pathObject.className === 'card');
      const targetEmail = cardDiv.lastElementChild.firstElementChild.nextElementSibling.textContent;
      const employee = employees.find(employee => employee.email === targetEmail);
      addModalInfo(employee);
      document.getElementsByClassName('modal-container')[0].style.display = "block"; 

    //change to previous employee if 'Prev' button clicked on modal
    } else if (e.target.id === 'modal-prev') {
      if (searchEmployees.length > 0) {
        processNextPrev(searchEmployees, "prev")
      } else {
        processNextPrev(employees, "prev");
      }

    //change to next employee if 'Prev' button clicked on modal
    } else if (e.target.id === 'modal-next') {
      if (searchEmployees.length > 0) {
        processNextPrev(searchEmployees, "next")
      } else {
        processNextPrev(employees, "next");
      }
    } 
  }); //end CLICK event listener

  //Process Search if Search Form is submitted
  document.addEventListener('submit', e => {
    e.preventDefault();
    processSearch(e.target.childNodes[0].value);
  });

  /** 
    FUNCTIONS TO CREATE EMPLOYEE CARDS AND MODAL CARD
  */
  function createEmployeeCards(employees) {
    const galleryDiv = document.getElementById('gallery');

    galleryDiv.innerHTML = '';

    employees.forEach(employee => {
      const employeeCard = `
        <div class="card">
          <div class="card-img-container">
              <img class="card-img" src="${employee.picture.medium}" alt="profile picture">
          </div>
          <div class="card-info-container">
              <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
              <p class="card-text">${employee.email}</p>
              <p class="card-text cap">${employee.location.state}, ${getCountry(employee.nat)}</p>
          </div>
        </div>
      `
      galleryDiv.innerHTML += employeeCard;
    });
  }

  function addModalInfo(employee) {
    const infoContainer = document.getElementsByClassName("modal-info-container")[0];
    const country = getCountry(employee.nat);

    const employeeInfo = `
      <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
      <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
      <p class="modal-text">${employee.email}</p>
      <p class="modal-text cap">${employee.location.state}, ${country}</p>
      <hr />
      <p class="modal-text">${formatPhoneNumber(employee.phone)}</p>
      <p class="modal-text cap">${employee.location.street}</p>
      <p class="modal-text cap">${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
      <p class="modal-text cap">${country}</p>
      <p class="modal-text">Birthday: ${formatBirthday(employee.dob.date)}</p>
    `;
     infoContainer.innerHTML = employeeInfo;
  }

  /** 
    FUNCTION TO CREATE MODAL 
  */
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

    // add prev / next buttons
    if (!(searchEmployees.length === 1)) {
      const buttonContainer = document.createElement("DIV");
      buttonContainer.classList.add("modal-btn-container");
      modalContainer.appendChild(buttonContainer);
      buttonContainer.innerHTML = '<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>';
      buttonContainer.innerHTML += '<button type="button" id="modal-next" class="modal-next btn">Next</button>';
    }
  }

  /** 
    FUNCTIONS TO PROCESS SEARCH
  */
  function processSearch(userInput) {
    searchEmployees = createSearchArray(userInput);
    if (searchEmployees.length) {
      createEmployeeCards(searchEmployees);
    } else {
      processNoResults();
    }
  }

  function createSearchForm() {
    const searchDiv = document.getElementsByClassName("search-container")[0];
    const searchForm  = document.createElement("FORM");
    searchForm.setAttribute('method',"get");
    searchForm.setAttribute('action',"#");
    searchDiv.appendChild(searchForm);
    searchForm.innerHTML = '<input type="search" id="search-input" class="search-input" placeholder="Search...">';
    searchForm.innerHTML += '<input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">';

    document.getElementById("search-input").addEventListener('click', function () {
      setTimeout(function() {
        resetAllEmployees();
      }, 20)
    });

    document.getElementById("search-input").addEventListener('keyup', function () {
      resetAllEmployees();
    });
  }

  function createSearchArray (userInput) {
  //  let searchEmployees = new Array();
    searchEmployees = [];
    userInput = userInput.trim().toLowerCase().replace(/  +/g, ' ');   

    employees.forEach(employee => {
      let name = employee.name.first + " " + employee.name.last;
      fName = employee.name.first.trim().toLowerCase();
      lName = employee.name.last.trim().toLowerCase(); //if more than one space in rest of name (ie. lilou le gall)

      if ((name.search(userInput) === 0) 
      || (fName.search(userInput) === 0)
      || (lName.search(userInput) === 0)) {
            searchEmployees.push(employee);
      }
    });
    return searchEmployees;
  }

  function processNoResults() {
    const divSearchContainer = document.getElementsByClassName('search-container')[0];
    if (document.getElementsByClassName('search-error').length === 0) {
      const divError = document.createElement('DIV');
      divError.classList.add('search-error');
      divError.innerHTML = '<p>Your search found no results</p>';
      divSearchContainer.appendChild(divError);
    }
    createEmployeeCards(employees);
    searchEmployees = [];
  }

  /** 
    HELPER FUNCTIONS
  */
  function checkStatus(response) {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  function resetAllEmployees() {
    if (document.getElementById("search-input").value === '') {
      //remove 'no search result' error message if exists
      const searchContainer = document.getElementsByClassName('search-container')[0];
      const errorDiv = document.getElementsByClassName('search-error');
      if (errorDiv.length) {
        searchContainer.removeChild(errorDiv[0]);
      }
      
      //Display all employees and reset searchEmployees array
      if (searchEmployees.length > 0) {
        createEmployeeCards(employees);
        searchEmployees = [];
      }
    }
  }

  function getCardIndex(employeeArray) {
    const targetEmail = document.getElementsByClassName("modal-text")[0].textContent;
    return employeeArray.findIndex((employee => employee.email === targetEmail));
  }

  function processNextPrev(employees, which) {
    indexOfCard = getCardIndex(employees);
    if (which === "next") {
      indexOfCard = (indexOfCard === employees.length - 1) ? 0 : (indexOfCard + 1);
    } else {
      indexOfCard = (indexOfCard) ? (indexOfCard - 1) : (employees.length - 1);
    }
    addModalInfo(employees[indexOfCard]);
  }

  function getCountry(employeeCountry) {
    const countryArray = [
      {abbr: "AU", country: "Australia"}, {abbr: "GB",country: "United Kingdom"},
      {abbr: "NZ", country: "New Zealand"}, {abbr: "US",country: "United States"}
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
}); //end content loaded
