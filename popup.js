document.addEventListener('DOMContentLoaded', function() {

    let table = document.getElementById("table");
    let counter = parseInt(localStorage.getItem('counter')) || 1;

    // Define the addRowToTable function
    function addRowToTable(index, username, password) {
        let row = table.insertRow(-1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);

        cell1.innerHTML = index;
        cell1.setAttribute('id', 'cell' + index);

        cell2.innerHTML = username;
        cell2.setAttribute('id', 'cell' + index);

        cell3.innerHTML = password;
        cell3.setAttribute('id', 'cell' + index);

        // Add a copy button
        cell4.innerHTML = `<button class="btn btn-secondary copy-btn">Copy</button> <input type="button" class="btn btn-secondary" value="remove"></input>`;
    }

    // Copy to clipboard function
    function copyToClipboard(value) {
        const tempInput = document.createElement('input');
        tempInput.value = value;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }

    // Autofill credentials based on the current website
    let currentWebsite = window.location.hostname;
    let storedUsername = localStorage.getItem(`username_${currentWebsite}`);
    let storedPassword = localStorage.getItem(`password_${currentWebsite}`);

    if (storedUsername && storedPassword) {
        addRowToTable(counter, storedUsername, storedPassword);
    }

    function add_credentials() {
        let cred_username = document.getElementById('username').value;
        let cred_password = document.getElementById('password').value;

        addRowToTable(counter, cred_username, cred_password);

        // Save credentials based on the current website
        localStorage.setItem(`username_${currentWebsite}`, cred_username);
        localStorage.setItem(`password_${currentWebsite}`, cred_password);
        localStorage.setItem('counter', counter);

        // Clear input values
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';

        counter = counter + 1;
    }

    document.getElementById('add-credentials').addEventListener("click", add_credentials);

    function remove_credentials(row) {
        let rowIndex = row.rowIndex;

        // Remove credentials based on the current website
        localStorage.removeItem(`username_${currentWebsite}`);
        localStorage.removeItem(`password_${currentWebsite}`);

        table.deleteRow(row.rowIndex);

        if (table.rows.length === 1) {
            counter = 1;
        }
    }

    table.addEventListener("click", function(event) {
        if (event.target.classList.contains("btn-secondary") && event.target.classList.contains("copy-btn")) {
            let row = event.target.parentNode.parentNode;
            let username = row.cells[1].innerHTML;
            let password = row.cells[2].innerHTML;
            copyToClipboard(`Username: ${username}, Password: ${password}`);
        } else if (event.target.classList.contains("btn-secondary")) {
            let row = event.target.parentNode.parentNode;
            remove_credentials(row);
        }
    });
});
