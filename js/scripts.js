document.addEventListener('DOMContentLoaded', () => {

  /** 
   * CLOBAL CONSTANTS
  */
  let employees = new Array();
  let searchEmployees = new Array();
 
  /** 
    FETCH PROMISE
    -Get 12 employees from randomuser.me, create page with employee data
  */
  fetch('https://randomuser.me/api/1.2/?format=json&results=12&nat=au,gb,nz,us')
    .then(checkStatus)
    .then(res => res.json())
    .then(data => {
      employees = data.results;
      createEmployeeCards(employees);
      createSearchForm();
    })
    .catch(error => {
      console.log(error);
      alert(`There was an error.  Please try again at another time. ${error}`);
    }
  );  //end fetch

  /** 
    EVENT LISTENERS
  */
  document.addEventListener('click', e => {

    //open modal when employee card is clicked  
    if (e.target.className.includes("card")) {
      const cardDiv = e.composedPath().find(pathObject => pathObject.className === 'card');
      const targetEmail = cardDiv.lastElementChild.firstElementChild.nextElementSibling.textContent;
      const employee = employees.find(employee => employee.email === targetEmail);
      addModalInfo(employee);
      document.getElementsByClassName('modal-container')[0].style.display = "block"; 

    //close button on modal
    } else if ((e.target.parentNode.className === "modal-close-btn") || (e.target.className === 'modal-close-btn')) {
      document.getElementsByClassName('modal-container')[0].style.display = "none";
      //re-display all employees if there has been a search. 
      const searchInput = document.getElementById('search-input')
      if (searchEmployees.length || searchInput.value.trim() !== '') {
        document.getElementById('search-input').value = '';
        resetAllEmployees();
      }

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

  /**
   * Presents employee cards for all employee objects passed in employees array
   * @param {object} employees - array of employee objects to be displayed as cards
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

    processModalContainer();
  }

  /**
   * Presents modal with information for one employee
   * @param {object} employee - Single employee object with info to be displayed on modal.
   */
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

  /**
   * Creates Modal and Modal container once when page with all employees are first loaded.
   * The navigation part of the modal is not displayed if there is only one employee found by Search
   */
  function processModalContainer () {
    if (!(document.querySelector('.modal-container'))) {
      createModalContainer();
    }

    if (searchEmployees.length === 1) {
      document.querySelector('.modal-btn-container').style.display = 'none';
    } else {
      document.querySelector('.modal-btn-container').style.display = 'block';
    }
  }

  /**
   * Add Modal DOM elements to the page
   */
  function createModalContainer() {
    const body = document.querySelector('body');
    const galleryNextSibling = document.getElementById('gallery').nextElementSibling;

    //add outer container
    const modalContainer = document.createElement("DIV");
    modalContainer.classList.add('modal-container');
    body.insertBefore(modalContainer, galleryNextSibling);

    //add modal container
    const modal = createAppendElement(modalContainer, 'modal', 'DIV');
    //add close 'X' button
    modal.innerHTML = '<button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>';

    //add info container
    createAppendElement(modal, 'modal-info-container', 'DIV');

    //add Prev / Next navigation buttons
    const buttonContainer = createAppendElement(modalContainer, 'modal-btn-container', 'DIV');
    buttonContainer.innerHTML = '<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>';
    buttonContainer.innerHTML += '<button type="button" id="modal-next" class="modal-next btn">Next</button>';
  }

  /** 
    FUNCTIONS TO PROCESS SEARCH
  */

  /**
   * If Search form is submitted, this process the search to display employees found
   * whose names match the string input.
   * @param {string} userInput - user input from search form field
   */
  function processSearch(userInput) {
    removeSearchErrorDiv();
    searchEmployees = createSearchArray(userInput);
    if (searchEmployees.length) {
      createEmployeeCards(searchEmployees);
    } else {
      processNoResults();
    }
  }

  /**
   * Create search form and append to page.
   * Add event listeners to re-display all employees if search box is cleared by
   * backspacing or deleting, or by clicking on the X in the search input element
   */
  function createSearchForm() {
    const searchDiv = document.getElementsByClassName("search-container")[0];
    const searchForm  = document.createElement("FORM");
    searchForm.setAttribute('method',"get");
    searchForm.setAttribute('action',"#");
    searchDiv.appendChild(searchForm);
    searchForm.innerHTML = '<input type="search" id="search-input" class="search-input" placeholder="Search...">';
    searchForm.innerHTML += '<input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">';

    //if user clicks X that appears in search input field in Chrome and other browsers
    document.getElementById("search-input").addEventListener('click', function () {
      setTimeout(function() { //wait 20 milliseconds for search input field to clear text
        resetAllEmployees();
      }, 20)
    });

    //user clears search input field by backspacing or deleting text
    document.getElementById("search-input").addEventListener('keyup', function () {
      resetAllEmployees();
    });
  }

  /**
   * Go through each employee, and if name, first name or last name even partially matches 
   * user input, then put employee in searchEmployees array.
   * @param {string} userInput - user input from search form field
   * @return {object} searchEmployees array of employees found from search
   */
  function createSearchArray (userInput) {
    searchEmployees = [];
    //if user enters more than one space between first and last name
    userInput = userInput.trim().toLowerCase().replace(/  +/g, ' ');   

    employees.forEach(employee => {
      let fName = employee.name.first.trim().toLowerCase();
      let lName = employee.name.last.trim().toLowerCase();
      let name = fName + " " + lName;

      if ((name.search(userInput) === 0) 
          || (fName.search(userInput) === 0)
          || (lName.search(userInput) === 0)) {
            searchEmployees.push(employee);
      }
    });
    return searchEmployees;
  }

  /**
   * If search found no results, display message under search input form and display all employees
   */
  function processNoResults() {
    const divSearchContainer = document.getElementsByClassName('search-container')[0];
    if (document.getElementsByClassName('search-error').length === 0) {
      divError = createAppendElement(divSearchContainer, 'search-error', 'DIV');
      divError.innerHTML = '<p>Your search found no results</p>';
    }
    createEmployeeCards(employees);
  }

  /** 
    HELPER FUNCTIONS
  */

  /**
   * This is a generalized function to create a DOM element, add a class, and append the element
   * to a parent.
   * @param {object} parent - DOM element of parent where child element will append
   * @param {string} childClass - name of class for new child element 
   * @param {string} elementName - type of element of created child (ie, DIV)
   * @return {object} - return newly created and appended element 
   */
  function createAppendElement (parent, childClass, elementName) {
    const element = document.createElement(elementName);
    element.classList.add(childClass);
    parent.appendChild(element);
    return element;
  }

/**
 * Checks response from Fetch Promise.  Will return an error if problems receiving
 * data or creating page from data. 
 * @param {object} response - response from Fetch Promise
 * @return {Promise} - resolve or reject (with error) of Promise 
 */
  function checkStatus(response) {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.status));
    }
  }

  /**
   * After search, re-display all employee cards, empty searcEmployees array, and
   * remove the search error message, if it exists.
   */
  function resetAllEmployees() {
    if (document.getElementById("search-input").value === '') {
      removeSearchErrorDiv();
      searchEmployees = [];
      createEmployeeCards(employees);
    }
  }

  /**
   * Remove Search found no results message
   */
  function removeSearchErrorDiv() {
    const searchContainer = document.getElementsByClassName('search-container')[0];
    const errorDiv = document.getElementsByClassName('search-error');
    if (errorDiv.length) {
      searchContainer.removeChild(errorDiv[0]);
    }
  }

  /**
   * Gets the array index of employee being displayed in modal.  Searches by email address.
   * @param {object} employeeArray - array of employees -- either all employees or employees from search 
   */
  function getCardIndex(employeeArray) {
    const targetEmail = document.getElementsByClassName("modal-text")[0].textContent;
    return employeeArray.findIndex((employee => employee.email === targetEmail));
  }

  /**
   * Display next or previous employee in Modal.
   * @param {object} employees - array of employees, either all employees or employees from search 
   * @param {string} which - indicates whether 'Next' or 'Previous' button clicked. 
   */
  function processNextPrev(employees, which) {
    indexOfCard = getCardIndex(employees);
    if (which === "next") {
      indexOfCard = (indexOfCard === employees.length - 1) ? 0 : (indexOfCard + 1);
    } else {
      indexOfCard = (indexOfCard) ? (indexOfCard - 1) : (employees.length - 1);
    }
    addModalInfo(employees[indexOfCard]);
  }

  /**
   * Gets country name by looking up country abbreviation sent in for employee from API
   * @param {string} employeeCountry - country of employee
   * @return {string} - country name
   */
  function getCountry(employeeCountry) {
    const countryArray = [
      {abbr: "AU", country: "Australia"}, {abbr: "GB", country: "United Kingdom"},
      {abbr: "NZ", country: "New Zealand"}, {abbr: "US", country: "United States"}
    ];
    return countryArray.find(country => employeeCountry === country.abbr).country;
  }

  /**
   * If there is a ) or - in the fourth phone number array position, will format employee
   * phone number as (123) 555-5555.  Match code found at:
   * https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript 
   * @param {string} phoneNumberString - phone number of employee
   * @return {string} phone number formatted or same string as param
   */
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

  /**
   * Formats birthday string for employee as MM/DD/YYYY
   * @param {string} birthday - birthday string passed in from API for employee
   * @return {string} formatted birthday: MM/DD/YYYY 
   */
  function formatBirthday(birthday) {
    birthday = new Date(birthday);
    return (birthday.getMonth() + 1) + "/" + birthday.getDate() + "/" + birthday.getFullYear();
  }
  
}); //end content loaded
