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
            main(data); // Pass the received data to createISTable function
        })
        .catch(error => console.error('Error:', error));
    }

    document.getElementById("tickerForm").addEventListener("submit", function(event) {
        event.preventDefault();
        fetchData();
    });
    
    function main(data) {
        title='Income Statement'
        var categoryOrder = ['SGA%', 'R&D%', 'Depreciation %', 'Operating Expense %', 'Interest Expense %', 'Total Revenue', 'Cost Of Revenue', 'Gross Profit', 'Gross Profit Margin', 'Pretax Income', 'Net Earnings', 'Basic EPS', 'Net Earnings to Total'];
        var IS=data["IS"]
        createTable(IS,categoryOrder,title)
        title='Balance Sheet: Assets'
        categoryOrder = ['Cash Cash Equivalents And Short Term Investments','Inventory', 'Receivables','Current Assets','Current Ratio','Net PPE','Total Non Current Assets','Total Assets','Return on Asset Ratio'];
        var ABS=data["ABS"]
        createTable(ABS,categoryOrder,title)
        title='Balance Sheet: Liabilities'
        categoryOrder = ['Payables And Accrued Expenses','Current Debt', 'Long Term Debt','Current Liabilities','Total Non Current Liabilities Net Minority Interest','Total Liabilities Net Minority Interest','Debt to Shareholders Equity Ratio','Treasury-adjusted Debt Shareholders Equity Ratio'];
        var LBS=data["LBS"]
        createTable(LBS,categoryOrder,title)
        title='Balance Sheet: Treasuries'
        categoryOrder = ['Capital Stock','Common Stock','Retained Earnings','Treasury Shares Number','Stockholders Equity','Return on Shareholders Equity','Adjusted Return on Equity'];
        var TBS=data["TBS"]
        createTable(TBS,categoryOrder,title)
        title='Cashflow Statement'
        categoryOrder = ['Net Income','Net Income From Continuing Operations','Capital Expenditures %', 'Net Common Stock Issuance'];
        var CF=data["CF"]
        createTable(CF,categoryOrder,title)
    }

    function formatNumber(number) {
        if (Math.abs(number) >= 1.0e+9) {
            return (Math.abs(number) / 1.0e+9).toFixed(2) + 'B';
        } else if (Math.abs(number) >= 1.0e+6) {
            return (Math.abs(number) / 1.0e+6).toFixed(2) + 'M';
        } else {
            return number.toFixed(2);
        }
    }

    function createTable(data,categoryOrder,title) {
        var tableContainer = document.getElementById("output");
        var table = document.createElement('table');
        table.style.borderCollapse = "collapse"; // Collapse borders
        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');
        table.style.width = '70%';
        table.style.marginLeft = 'auto';
        table.style.marginRight = 'auto';

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
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        Object.keys(data).forEach(function(year) {
            var yearData = data[year];
            var row = document.createElement('tr');
            var yearCell = document.createElement('td');
            yearCell.textContent = year;
            yearCell.style.border = "1px solid black";
            row.appendChild(yearCell);

            categoryOrder.forEach(function(category) {
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


