document.addEventListener("DOMContentLoaded", function() {
    // Your JavaScript code here
    function fetchData(){
        var input = document.getElementById("ticker").value;
        console.log("Ticker input value:", input);
        var data = {'ticker': input};
        fetch('https://pythia-14fbe9516611.herokuapp.com/main', {
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
        output.innerHTML = "";
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
        categoryOrder = ['Common Stock','Retained Earnings','Treasury Shares Number','Stockholders Equity','Return on Shareholders Equity'];
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
