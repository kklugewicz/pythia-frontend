document.addEventListener("DOMContentLoaded", function() {
    // Your JavaScript code here
    function fetchData(){
        var input = document.getElementById("ticker").value;
        console.log("Ticker input value:", input);
        var data = {'ticker': input};
        fetch('http://127.0.0.1:5000/main', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data})
        })
        .then(response => response.json())
        .then(data => {
            // Process the received data
            console.log("Received data:",data);
            main(data); // Pass the received data to createISTable function
        })
        .catch(error => console.error('Error:', error));
    }

    document.getElementById("tickerForm").addEventListener("submit", function(event) {
        event.preventDefault();
        fetchData();
    });
    

    
    function main(data) {
        var output = document.getElementById("output");
        var compareButtonDiv = document.getElementById("compare-button");
        var companyName = document.getElementById("company-title");
        output.innerHTML = "";
        compareButtonDiv.innerHTML = "";
        var inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.placeholder = "Enter tickers to compare:";
        inputBox.id = "compareInput"; // Assign an ID to the input box
        compareButtonDiv.appendChild(inputBox);
        
        var compareButton = document.createElement("button");
        compareButton.innerHTML = "Compare";
        
        compareButton.addEventListener("click", function(event) {
            event.preventDefault();
            var outputDiv = document.getElementById("compare-button");
            var inputValue = outputDiv.querySelector("#compareInput").value;
            var data1=data
            fetchData2(inputValue, data1); // Pass inputValue and data to fetchData2
    });
        // Append the compare button to the output div
        compareButtonDiv.appendChild(compareButton);
        var companyName=data["Company Name"]
        addTitle(companyName)
        title='Income Statement'
        var categoryOrder = ['SGA%', 'R&D%', 'Depreciation %', 'Operating Expense %', 'Interest Expense %','Operating Margin', 'Total Revenue', 'Cost Of Revenue', 'Gross Profit', 'Gross Profit Margin', 'Pretax Income', 'Net Earnings', 'Basic EPS', 'Net Earnings to Total'];
        var IS=data["IS"]
        createTable(IS,categoryOrder,title)
        title='Balance Sheet: Assets'
        categoryOrder = ['Cash And Cash Equivalents','Inventory', 'Receivables','Current Assets','Current Ratio','Fixed Asset Turnover Ratio','Total Non Current Assets','Total Assets','Return on Asset Ratio'];
        var ABS=data["ABS"]
        createTable(ABS,categoryOrder,title)
        title='Balance Sheet: Liabilities'
        categoryOrder = ['Payables And Accrued Expenses','Current Debt', 'Long Term Debt','Current Liabilities','Total Non Current Liabilities Net Minority Interest','Total Liabilities Net Minority Interest','Net Debt','Total Debt','Debt to Shareholders Equity Ratio'];
        var LBS=data["LBS"]
        createTable(LBS,categoryOrder,title)
        title='Balance Sheet: Treasuries'
        categoryOrder = ['Common Stock','Retained Earnings','Stockholders Equity','Return on Shareholders Equity'];
        var TBS=data["TBS"]
        createTable(TBS,categoryOrder,title)
        title='Cashflow Statement'
        categoryOrder = ['Free Cash Flow','Net Income','Net Income From Continuing Operations','Capital Expenditures %', 'Net Common Stock Issuance'];
        var CF=data["CF"]
        createTable(CF,categoryOrder,title)
        title='Valuation Models'
        categoryOrder = ['Current Stock Price','Trailing P/E','Forward P/E','Trailing PEG Ratio','P/FCF','Discounted Cash Flow Model','Peter Lynchs Valuation','Benjamin Grahams Valuation','Multiples Valuation','Dividend Discount Model'];
        var Valuations=data["Valuations"]
        createTable(Valuations,categoryOrder,title)
    }

    function addTitle(title) {
        document.getElementById("company-title").innerHTML=title
    }

    function createTable(data,categoryOrder,title) {
        var tableContainer = document.getElementById("output");
        //Create variables for table elements
        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');

        //Edit Style
        table.style.borderCollapse = "collapse"; 
        table.style.width = '70%';
        table.style.marginLeft = 'auto';
        table.style.marginRight = 'auto';
        //Create caption
        var caption = table.createCaption();
        caption.textContent = title;
        caption.classList.add('table-caption');

        // Create table header
        var headerRow = document.createElement('tr');

        // Add 'Year' as the first header
        var yearHeader = document.createElement('th');
        yearHeader.textContent = 'Year';
        yearHeader.style.border = "1px solid black";
        headerRow.appendChild(yearHeader);

        // Add other headers in the specified order
        categoryOrder.forEach(function(header) {
            var th = document.createElement('th');
            th.textContent = header;
            th.style.border = "1px solid black";
            headerRow.appendChild(th);

            th.addEventListener('click', function () {
                openBox(header);
            });
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        Object.keys(data).forEach(function (year) {
            var yearData = data[year];
            var row = document.createElement('tr');
            var yearCell = document.createElement('td');
            yearCell.textContent = year;
            yearCell.style.border = "1px solid black";
            row.appendChild(yearCell);
    
            categoryOrder.forEach(function (category, index) {
                var cell = document.createElement('td');
                var value = yearData[category];
                cell.textContent = (typeof value === 'number') ? formatNumber(value) : value || '';
                cell.style.border = "1px solid black";
                row.appendChild(cell);
            });

            tbody.appendChild(row);
        });

        table.appendChild(tbody);

        // Append table to document body
        tableContainer.appendChild(table);
    }

});

function formatNumber(number) {
    if (Math.abs(number) >= 1.0e+9) {
        return (Math.abs(number) / 1.0e+9).toFixed(2) + 'B';
    } else if (Math.abs(number) >= 1.0e+6) {
        return (Math.abs(number) / 1.0e+6).toFixed(2) + 'M';
    } else if (Math.abs(number) >= 1.0e+3) {
        return (Math.abs(number) / 1.0e+3).toFixed(2) + 'K';
    } else {
        return number.toFixed(2);
    }
}    

function openBox(header) {
    fetch('category_definitions.txt') // Fetch the generic text file
    .then(response => response.text())
    .then(data => {
        // Split the content by '!' to separate different sections
        var sections = data.split('!');
        
        // Iterate through each section
        for (var i = 0; i < sections.length; i++) {
            var lines = sections[i].split('\n'); // Split section into lines
            
            // Find the header within the lines of the current section
            var headerIndex = lines.findIndex(line => line.trim() === header);
            
            // If header is found
            if (headerIndex !== -1) {
                var output = ''; // Initialize output string
                
                // Iterate through lines starting from the line after the header
                for (var j = headerIndex + 1; j < lines.length; j++) {
                    // If line is not empty and does not contain '!'
                    if (lines[j].trim() !== '') {
                        output += lines[j] + '\n'; // Add line to output
                    } else {
                        break; // Exit loop if empty line or '!' is encountered
                    }
                }
                
                alert(output); // Show an alert with the output
                return; // Exit the function
            }
        }
        
        // If header is not found
        alert('Header not found!');
    })
    .catch(error => console.error('Error fetching file:', error));
}

function fetchData2(inputValue,data1){
    console.log("Ticker input value:", inputValue);
    var data = {'ticker': inputValue};
    fetch('http://127.0.0.1:5000/main', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
    })
    .then(response => response.json())
    .then(data => {
        // Process the received data
        console.log("Received data:",data);
        compareFunction(data1,data,inputValue); // Pass the received data to createISTable function
    })
    .catch(error => console.error('Error:', error));
}

function compareFunction(data1,data,inputValue) {
    var output = document.getElementById("output");
    var compareButtonDiv = document.getElementById("compare-button");
    var companyName = document.getElementById("company-title");
    var mainCompany = data1["Company Name"];
    var compareCompany = data["Company Name"]
    output.innerHTML = "";
    compareButtonDiv.innerHTML = "";
    companyName.innerHTML="";
    var divToDelete = document.getElementById("new-line");
    divToDelete.parentNode.removeChild(divToDelete);
    title='Income Statement'
    var categoryOrder = ['SGA%', 'R&D%', 'Depreciation %', 'Operating Expense %', 'Interest Expense %','Operating Margin', 'Total Revenue', 'Cost Of Revenue', 'Gross Profit', 'Gross Profit Margin', 'Pretax Income', 'Net Earnings', 'Basic EPS', 'Net Earnings to Total'];
    var IS1=data1["IS"]
    var IS2=data["IS"]
    createCompareTable(IS1,IS2,categoryOrder,title,mainCompany,compareCompany)
    title='Balance Sheet: Assets'
    categoryOrder = ['Cash And Cash Equivalents','Inventory', 'Receivables','Current Assets','Current Ratio','Fixed Asset Turnover Ratio','Total Non Current Assets','Total Assets','Return on Asset Ratio'];
    var ABS1=data1["ABS"]
    var ABS2=data["ABS"]
    createCompareTable(ABS1,ABS2,categoryOrder,title,mainCompany,compareCompany)
    title='Balance Sheet: Liabilities'
    categoryOrder = ['Payables And Accrued Expenses','Current Debt', 'Long Term Debt','Current Liabilities','Total Non Current Liabilities Net Minority Interest','Total Liabilities Net Minority Interest','Net Debt','Total Debt','Debt to Shareholders Equity Ratio'];
    var LBS1=data1["LBS"]
    var LBS2=data["LBS"]
    createCompareTable(LBS1,LBS2,categoryOrder,title,mainCompany,compareCompany)
    title='Balance Sheet: Treasuries'
    categoryOrder = ['Common Stock','Retained Earnings','Stockholders Equity','Return on Shareholders Equity'];
    var TBS1=data1["TBS"]
    var TBS2=data["TBS"]
    createCompareTable(TBS1,TBS2,categoryOrder,title,mainCompany,compareCompany)
    title='Cashflow Statement'
    categoryOrder = ['Free Cash Flow','Net Income','Net Income From Continuing Operations','Capital Expenditures %', 'Net Common Stock Issuance'];
    var CF1=data1["CF"]
    var CF2=data["CF"]
    createCompareTable(CF1,CF2,categoryOrder,title,mainCompany,compareCompany)
    title='Valuation Models'
    categoryOrder = ['Current Stock Price','Trailing P/E','Forward P/E','Trailing PEG Ratio','P/FCF','Discounted Cash Flow Model','Peter Lynchs Valuation','Benjamin Grahams Valuation','Multiples Valuation','Dividend Discount Model'];
    var Valuations1=data1["Valuations"]
    var Valuations2=data["Valuations"]
    createCompareTable(Valuations1,Valuations2,categoryOrder,title,mainCompany,compareCompany)
}

function createCompareTable(data1, data2, categoryOrder, title,mainCompany,compareCompany) {
    var tableContainer = document.getElementById("output");
    //Create variables for table elements
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');

    //Edit Style
    table.style.borderCollapse = "collapse"; 
    table.style.width = '70%';
    table.style.marginLeft = 'auto';
    table.style.marginRight = 'auto';
    //Create caption
    var caption = table.createCaption();
    caption.textContent = title;
    caption.classList.add('table-caption');

    // Create table header
    var headerRow = document.createElement('tr');

    // Add 'Year' as the first header
    var yearHeader = document.createElement('th');
    yearHeader.textContent = 'Year';
    yearHeader.style.border = "1px solid black";
    headerRow.appendChild(yearHeader);

    // Add other headers in the specified order
    categoryOrder.forEach(function(header) {
        var th = document.createElement('th');
        th.textContent = header;
        th.style.border = "1px solid black";
        headerRow.appendChild(th);

        th.addEventListener('click', function () {
            openBox(header);
        });
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create row for "main company"
    var mainCompanyRow = document.createElement('tr');
    var mainCompanyCell = document.createElement('td');
    mainCompanyCell.textContent = mainCompany;
    mainCompanyCell.style.border = "1px solid black";
    mainCompanyCell.colSpan = categoryOrder.length + 1; // Span all columns
    mainCompanyRow.appendChild(mainCompanyCell);
    tbody.appendChild(mainCompanyRow);
    
    // Create table body for data1
    Object.keys(data1).forEach(function (year) {
        var yearData = data1[year];
        var row = document.createElement('tr');
        var yearCell = document.createElement('td');
        yearCell.textContent = year;
        yearCell.style.border = "1px solid black";
        row.appendChild(yearCell);

        categoryOrder.forEach(function (category, index) {
            var cell = document.createElement('td');
            var value = yearData[category];
            cell.textContent = (typeof value === 'number') ? formatNumber(value) : value || '';
            cell.style.border = "1px solid black";
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    // Create row for "Other company"
    var otherCompanyRow = document.createElement('tr');
    var otherCompanyCell = document.createElement('td');
    otherCompanyCell.textContent = compareCompany;
    otherCompanyCell.style.border = "1px solid black";
    otherCompanyCell.colSpan = categoryOrder.length + 1; // Span all columns
    otherCompanyRow.appendChild(otherCompanyCell);
    tbody.appendChild(otherCompanyRow);

    // Create table body for last two years of data2
    var data2Keys = Object.keys(data2);
    var startIdx = Math.max(data2Keys.length - 2, 0); // Start from the last two years or 0 if less than two years
    data2Keys.slice(startIdx).forEach(function (year) {
        var yearData = data2[year];
        var row = document.createElement('tr');
        var yearCell = document.createElement('td');
        yearCell.textContent = year;
        yearCell.style.border = "1px solid black";
        row.appendChild(yearCell);

        categoryOrder.forEach(function (category, index) {
            var cell = document.createElement('td');
            var value = yearData[category];
            cell.textContent = (typeof value === 'number') ? formatNumber(value) : value || '';
            cell.style.border = "1px solid black";
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    // Append table to document body
    tableContainer.appendChild(table);
}

// Function to read conditions from text file
function readConditionsFromFile(filename) {
    return fetch(filename)
        .then(response => response.text())
        .then(data => {
            // Split the content by '!' to separate different sections
            var sections = data.split('!');
            var conditions = {};
            
            // Iterate through each section
            sections.forEach(section => {
                var lines = section.split('\n'); // Split section into lines
                var columnName = lines[0].trim(); // First line is the column name
                conditions[columnName] = {}; // Initialize conditions for this column
                
                // Iterate through lines starting from the second line
                for (var i = 1; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (line.startsWith('G:')) {
                        conditions[columnName].greaterThan = parseFloat(line.substring(2));
                    } else if (line.startsWith('R:')) {
                        conditions[columnName].lessThan = parseFloat(line.substring(2));
                    }
                }
            });
            
            return conditions;
        })
        .catch(error => {
            console.error('Error reading conditions:', error);
            return {};
        });
}

function applyHighlighting(captionText, columnName, value) {
    // Read conditions from file
    readConditionsFromFile("highlight_conditions.text")
    .then(conditions => {
        // Escape special characters in the column name and caption text
        var escapedColumnName = columnName.replace(/([ #;&,.+*~':"!^$[\]()=>|\/@])/g,'\\$1');
        var escapedCaptionText = captionText.replace(/([ #;&,.+*~':"!^$[\]()=>|\/@])/g,'\\$1');
        
        // Get the cell corresponding to the value within the specified table
        console.log(captionText)
        console.log(columnName)
        console.log(value)
        var escapedId = columnName.replace(/([ #;&,.+*~':"!^$[\]()=>|\/@])/g,'\\$1');
        var cell = document.querySelector(`caption:contains('${escapedCaptionText}') ~ table #${escapedId} td:nth-child(${parseInt(value) + 1})`);
        if (!cell) return; // Cell not found

        // Apply highlighting based on conditions
        if (conditions[columnName]) {
            var { greaterThan, lessThan } = conditions[columnName];
            if (greaterThan !== undefined && lessThan !== undefined) {
                if (value > greaterThan && value < lessThan) {
                    cell.style.backgroundColor = 'yellow';
                } else if (value > greaterThan) {
                    cell.style.backgroundColor = 'green';
                } else if (value < lessThan) {
                    cell.style.backgroundColor = 'red';
                }
            } else if (greaterThan !== undefined) {
                if (value > greaterThan) {
                    cell.style.backgroundColor = 'green';
                }
            } else if (lessThan !== undefined) {
                if (value < lessThan) {
                    cell.style.backgroundColor = 'red';
                }
            }
        }
    })
    .catch(error => console.error('Error applying highlighting:', error));
}
