function dropdown(id) {
    var dropdown = document.getElementsByClassName("sidebar-link sub");
    var i;

    for (i = 0; i < dropdown.length; i++) {
        submenu = dropdown[i].nextElementSibling;
        if (submenu.style.display === "block") {
            submenu.style.display = "none";
        }
    }
    document.getElementById(id).classList.toggle("d-block");
}

function accordion() {
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.classList.contains("d-flex")) {
                panel.classList.remove("d-flex");
            } else {
                panel.classList.add("d-flex");
            }
        });
    }
}

function sidebar() {
    let sidebar = document.getElementById('sidebar');
    let bg = document.getElementById('sidebar-bg');

    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        bg.classList.remove('sidebar-backdrop');
    }
    else {
        sidebar.classList.add('active');
        bg.classList.add('sidebar-backdrop');
    }
}

function search1() {
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("table1");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            }
            else {
                tr[i].style.display = "none";
            }
        }
    }
}

function search() {
    let input, filter, select, option, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    select = document.getElementById("select");
    option = select.getElementsByTagName("option");
    for (i = 0; i < option.length; i++) {
        optionValue = option[i];
        if (optionValue) {
            txtValue = optionValue.textContent || optionValue.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                optionValue[i].style.display = "";
            }
            else {
                optionValue[i].style.display = "none";
            }
        }
    }
}

function search(id) {
    let input, filter, table, tr, td, i, txtValue;
    var select = document.getElementById("sort");
    input = document.getElementById("search");
    table = document.getElementById(id);
    if (id === 'table2') {
        select = document.getElementById("sort2");
        input = document.getElementById("search2");
    } else if (id === 'table3') {
        select = document.getElementById("sort3");
        input = document.getElementById("search3");
    } else if (id === 'table4') {
        select = document.getElementById("sort4");
        input = document.getElementById("search4");
    } else if (id === 'table5') {
        select = document.getElementById("sort5");
        input = document.getElementById("search5");
    } else if (id === 'table6') {
        select = document.getElementById("sort6");
        input = document.getElementById("search6");
    }
    var value = select.options[select.selectedIndex].value;
    filter = input.value.toUpperCase();
    tr = table.getElementsByTagName("tr");
    if (value == "0") {
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                }
                else {
                    tr[i].style.display = "none";
                }
            }
        }
    } else if (value == "1") {
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[1];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                }
                else {
                    tr[i].style.display = "none";
                }
            }
        }
    } else if (value == "2") {
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[2];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                }
                else {
                    tr[i].style.display = "none";
                }
            }
        }
    } else if (value == "3") {
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[3];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                }
                else {
                    tr[i].style.display = "none";
                }
            }
        }
    } else if (value == "4") {
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[4];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                }
                else {
                    tr[i].style.display = "none";
                }
            }
        }
    } else if (value == "5") {
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[5];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                }
                else {
                    tr[i].style.display = "none";
                }
            }
        }
    } else if (value == "6") {
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[6];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                }
                else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}

function authentication(type) {
    let signup = document.getElementById('signup');
    let login = document.getElementById('login');
    let signupLink = document.getElementById('signupLink');
    let loginLink = document.getElementById('loginLink');
    let alert = document.getElementById('alert');

    if(type == 'signup'){
        if (signup.style.display == 'none') {
            if (alert != null) {
                alert.style.display = 'none';
            }
            signup.style.display = 'block';
            login.style.display = 'none';
            signupLink.classList.remove('text-muted');
            signupLink.classList.add('bg-white');
            signupLink.classList.add('rounded-bottom');
            signupLink.classList.add('border-bottom');
            signupLink.classList.add('border-primary');
            loginLink.classList.add('text-muted');
            loginLink.classList.remove('bg-white');
            loginLink.classList.remove('rounded-bottom');
            loginLink.classList.remove('border-bottom');
            loginLink.classList.remove('border-primary');
        }
    }else{
        if (login.style.display == 'none') {
            if (alert != null) {
                alert.style.display = 'none';
            }
            login.style.display = 'block';
            signup.style.display = 'none';
            loginLink.classList.remove('text-muted');
            loginLink.classList.add('bg-white');
            loginLink.classList.add('rounded-bottom');
            loginLink.classList.add('border-bottom');
            loginLink.classList.add('border-primary');
            signupLink.classList.add('text-muted');
            signupLink.classList.remove('bg-white');
            signupLink.classList.remove('rounded-bottom');
            signupLink.classList.remove('border-bottom');
            signupLink.classList.remove('border-primary');
        }
    }
}

function select(id) {
    var i, days, selected;
    selected = document.getElementById(id);
    days = document.getElementsByClassName("day");
    for (i = 0; i < days.length; i++) {
        if (!days[i].classList.contains("text-muted")) {
            days[i].classList.add("text-muted");
        }
        if (days[i].classList.contains("bg-white")) {
            days[i].classList.remove("bg-white");
            days[i].classList.remove("shadow");
        }
    }
    if (selected.classList.contains("text-muted")) {
        selected.classList.remove("text-muted");
        selected.classList.add("bg-white");
        selected.classList.add("shadow");
    }
}