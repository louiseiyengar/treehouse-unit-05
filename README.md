# FSJS project 5 - Public API Request

For this project, I requested, via the Fetch API, 12 employees from https://randomuser.me/. Employees are from Australia, United Kingdom, New Zealand, and the United States.  I used the information to display the employees as 'cards' on a startup company employee directory web page.

======= About Modal =============================

If you click an employee, a modal will appear with further information about the employee.  There are "Prev' and 'Next' navigation buttons that will allow you to view the employees listed on the page in th modal.  

Please note: when you reach the last employee, if you click 'Next', the first employee on the page will be listed, so you can continue to cycle through all employees.  Similarly, when you reach the first employee, if you click 'Prev', the last employee displayed will appear in the modal.

To return to viewing all employees, click the 'X' in the modal area.

======= About Search =============================

There is a search form field allowing you to filter employees by name.  If you submit even a partial portion of the name (including just one letter).  Employees whose full names, first name, or last name match what has been entered, will appear on the web page.  (For example, if you type the letter 'M', employees whose first and last names start with 'M" will appear).

If more than one employee matches your search, you can use the navigation buttons to view the 'matched' employees in the modal.

To return to view all employees, you can: 1) Delete search name in the search input field, 2) Click on the 'X' in the search input field to delete the search text, or 3) click on the 'X' in the modal area, if you are viewing a searched employee in the modal.

======= Design Modifications ======================

1) Because I am using employees from different countries, I put states and countries on the employee cards.  I also put the country with the modal information.
2) I reduced the line-height on the cards.
3) I added color to header, a small border-bottom, text-shadow and increased font on the header text.
4) I added a drop-shadow to the hover state for the employee cards.
5) I added a drop-shadow to the modal.
6) I added keyframe opacity animation when the modal appears.
7) For the 'X' close button on the modal, I added to the hover state: drop-shadow, white background color and black text color.

Screenshot of search for 'R' names with modal:
![Unit05Example](https://user-images.githubusercontent.com/42808209/55358772-2727da80-549e-11e9-9e33-ee4e028dcabe.jpg)
