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
        var compareButtonDiv = document.getElementById("compare-button");
        var companyName = document.getElementById("company-title");
        var summaryDiv=document.getElementById('summary');
        var summaryBox=document.getElementById('summaryBox')
        if (summaryDiv.contains(summaryBox)) {
            summaryDiv.removeChild(summaryBox);
        }
        var line = document.querySelector('#new-line');
        if (line == null) {
            var newLine = document.getElementById('new-line');
            const lineBreak=document.createElement('br');
            newLine.appendChild(lineBreak);
        }
        output.innerHTML = "";
        var summaryBox=document.createElement('div');
        summaryBox.id = 'summaryBox';
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
        var summary=data['Summary'];
        summaryBox.innerHTML = summary;
        summaryDiv.appendChild(summaryBox);
        var data2 = {};
        var companyName=data["Company Name"]
        addTitle(companyName)
        var basics=data['Basics']
        var categoryOrder=['Industry','Market Cap', 'Current Stock Price']
        createTable(basics,categoryOrder,'Basic Stock Info')
        title='Income Statement'
        var IS=data["IS"]
        var categoryOrder = createList(IS, data2, 'IS')
        createTable(IS,categoryOrder,title)
        title='Balance Sheet: Assets'
        var ABS=data["ABS"]
        var categoryOrder = createList(ABS, data2, 'ABS')
        createTable(ABS,categoryOrder,title)
        title='Balance Sheet: Liabilities'
        var LBS=data["LBS"]
        var categoryOrder = createList(LBS, data2, 'LBS')
        createTable(LBS,categoryOrder,title)
        title='Balance Sheet: Treasuries'
        var TBS=data["TBS"]
        var categoryOrder = createList(TBS, data2, 'TBS')
        createTable(TBS,categoryOrder,title)
        title='Cashflow Statement'
        var CF=data["CF"]
        var categoryOrder = createList(CF, data2, 'CF')
        createTable(CF,categoryOrder,title)
        title='Valuation Models'
        var Valuations=data["Valuations"]
        var categoryOrder = createList(Valuations, data2, 'Valuations')
        createTable(Valuations,categoryOrder,title)
    }

});

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
    yearHeader.style.backgroundColor = '#e5e5ec ';
    headerRow.appendChild(yearHeader);

    // Add other headers in the specified order
    categoryOrder.forEach(function(header) {
        var th = document.createElement('th');
        th.textContent = header;
        th.style.border = "1px solid black";
        th.style.backgroundColor = '#e5e5ec ';
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
        yearCell.style.backgroundColor = '#e5e5ec ';
        row.appendChild(yearCell);

        categoryOrder.forEach(function (category, index) {
            var cell = document.createElement('td');
            var value = yearData[category];

            cell.textContent = (typeof value === 'number') ? formatNumber(value) : value || '';
            cell.style.border = "1px solid black";
            cell.style.backgroundColor = getColorForValue(value,category,year);
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    // Append table to document body
    tableContainer.appendChild(table);
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
    fetch('https://pythia-14fbe9516611.herokuapp.com/main', {
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
    var summary = document.getElementById('summary')
    var summaryBox=document.getElementById('summaryBox')
    summary.removeChild(summaryBox)
    var mainCompany = data1["Company Name"];
    var compareCompany = data["Company Name"]
    output.innerHTML = "";
    compareButtonDiv.innerHTML = "";
    companyName.innerHTML="";
    var line = document.querySelector('#new-line');
    if (line == null) {
        var divToDelete = document.getElementById("new-line");
        divToDelete.removeChild(divToDelete.firstChild); }
    var basics1=data1['Basics']
    var basics2=data['Basics']
    var categoryOrder=['Industry','Market Cap', 'Current Stock Price']
    createCompareTable(basics1,basics2,categoryOrder,'Basic Stock Info',mainCompany,compareCompany)
    title='Income Statement'
    var IS1=data1["IS"]
    var IS2=data["IS"]
    var categoryOrder = createList(IS1, IS2, 'IS')
    createCompareTable(IS1,IS2,categoryOrder,title,mainCompany,compareCompany)
    title='Balance Sheet: Assets'
    var ABS1=data1["ABS"]
    var ABS2=data["ABS"]
    var categoryOrder = createList(ABS1, ABS2, 'ABS')
    createCompareTable(ABS1,ABS2,categoryOrder,title,mainCompany,compareCompany)
    title='Balance Sheet: Liabilities'
    var LBS1=data1["LBS"]
    var LBS2=data["LBS"]
    var categoryOrder = createList(LBS1, LBS2, 'LBS')
    createCompareTable(LBS1,LBS2,categoryOrder,title,mainCompany,compareCompany)
    title='Balance Sheet: Treasuries'
    var TBS1=data1["TBS"]
    var TBS2=data["TBS"]
    var categoryOrder = createList(TBS1, TBS2, 'TBS')
    createCompareTable(TBS1,TBS2,categoryOrder,title,mainCompany,compareCompany)
    title='Cashflow Statement'
    var CF1=data1["CF"]
    var CF2=data["CF"]
    var categoryOrder = createList(CF1, CF2, 'CF')
    createCompareTable(CF1,CF2,categoryOrder,title,mainCompany,compareCompany)
    title='Valuation Models'
    var Valuations1=data1["Valuations"]
    var Valuations2=data["Valuations"]
    var categoryOrder = createList(Valuations1, Valuations2, 'Valuations')
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
    yearHeader.style.backgroundColor = '#e5e5ec ';
    headerRow.appendChild(yearHeader);

    // Add other headers in the specified order
    categoryOrder.forEach(function(header) {
        var th = document.createElement('th');
        th.textContent = header;
        th.style.border = "1px solid black";
        th.style.backgroundColor = '#e5e5ec '
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
    mainCompanyCell.style.backgroundColor = '#e5e5ec ';
    mainCompanyCell.colSpan = categoryOrder.length + 1; // Span all columns
    mainCompanyRow.appendChild(mainCompanyCell);
    tbody.appendChild(mainCompanyRow);
    
    // Create table body for data1
    Object.keys(data1).forEach(function (year) {
        var yearData = data1[year];
        var row = document.createElement('tr');
        var yearCell = document.createElement('td');
        yearCell.textContent = year;
        yearCell.style.backgroundColor = '#e5e5ec ';
        yearCell.style.border = "1px solid black";
        row.appendChild(yearCell);

        categoryOrder.forEach(function (category, index) {
            var cell = document.createElement('td');
            var value = yearData[category];
            cell.textContent = (typeof value === 'number') ? formatNumber(value) : value || '';
            cell.style.border = "1px solid black";
            cell.style.backgroundColor = getColorForValue(value,category,year);
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    // Create row for "Other company"
    var otherCompanyRow = document.createElement('tr');
    var otherCompanyCell = document.createElement('td');
    otherCompanyCell.textContent = compareCompany;
    otherCompanyCell.style.backgroundColor = '#e5e5ec ';
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
        yearCell.style.backgroundColor = '#e5e5ec ';
        yearCell.style.border = "1px solid black";
        row.appendChild(yearCell);

        categoryOrder.forEach(function (category, index) {
            var cell = document.createElement('td');
            var value = yearData[category];
            cell.textContent = (typeof value === 'number') ? formatNumber(value) : value || '';
            cell.style.border = "1px solid black";
            cell.style.backgroundColor = getColorForValue(value,category,year);
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    // Append table to document body
    tableContainer.appendChild(table);
}

function getColorForValue(value,category,year) {
    if (typeof value !== 'number' && typeof value !== 'string') {
        return '#e5e5ec '
    };
    if (typeof value !== 'number') {
        var num = parseFloat(value.replace(/[^0-9.-]/g, ''));
    };
    var valueRange={
        'SGA%': {
            'topIdealRange': 30,
            'bottomIdealRange': '',
            'bufferValue': 70
        },
        'R&D%': {
            'topIdealRange': 30,
            'bottomIdealRange': '',
            'bufferValue': 70
        },
        'Depreciation %': {
            'topIdealRange':10,
            'bottomIdealRange': '',
            'bufferValue':10
        },
        'Net Earnings to Total': {
            'topIdealRange':'',
            'bottomIdealRange': 20,
            'bufferValue':10
        },
        'Return on Shareholders Equity': {
            'topIdealRange':'',
            'bottomIdealRange': 20,
            'bufferValue':0
        },
        'Capital Expenditures %': {
            'topIdealRange':25,
            'bottomIdealRange': '',
            'bufferValue':35
        },
        'Interest Expense %': {
            'topIdealRange':15,
            'bottomIdealRange': '',
            'bufferValue':''
        },
        'Current Ratio' : {
            'topIdealRange':'',
            'bottomIdealRange': 1,
            'bufferValue':0.2
        },
        'Return on Asset Ratio' : {
            'topIdealRange':'',
            'bottomIdealRange': 20,
            'bufferValue':17
        },
        'Debt to Shareholders Equity Ratio' : {
            'topIdealRange':100,
            'bottomIdealRange': '',
            'bufferValue':100
        },
        'Operating Margin' : {
            'topIdealRange':'',
            'bottomIdealRange': 15,
            'bufferValue':13
        },
        'Gross Profit Margin' : {
            'topIdealRange':'',
            'bottomIdealRange': 40,
            'bufferValue':20
        }

    };
    if (year=='YoY(past year)'){
        return '#e5e5ec '
    };
    if (!(category in valueRange)){
        return '#e5e5ec '
    };
    var valueRangeC=valueRange[category];
    var topIdealRange=valueRangeC['topIdealRange'];
    var bottomIdealRange=valueRangeC['bottomIdealRange'];
    var bufferValue=valueRangeC['bufferValue'];
    if (typeof num =='') {
        return '';
    };
    if (topIdealRange =='') {
        if (num > bottomIdealRange) {
            return 'green'
        } else if (num < (bottomIdealRange-bufferValue)) {
            return 'red'
        } else {
            return 'yellow'
        }
    } else if (bottomIdealRange =='') {
        if (num < topIdealRange) {
            return 'green'
        } else if (num > (topIdealRange+bufferValue)) {
            return 'red'
        } else {
            return 'yellow'
        }
    } else {
        if (num < topIdealRange && num > bottomIdealRange){
            return 'green'
        } else if (num>topIdealRange+bufferValue || num<bottomIdealRange-bufferValue) {
            return 'red'
        } else {
            return 'yellow'
        }
    };
}

function createList(data,data2,type) {
    console.log(data)
    if (type=='Valuations') {
        data=data['current']
        if ('current' in data2) {
            data2 =data2['current']
        }
        else {
            data2={}
        }
    }
    else {
        var data =data['YoY(past year)']
        
        if ('YoY(past year)' in data2) {
            data2 =data2['YoY(past year)']
        }
        else {
            data2={}
    }
    }
    if (type=='IS') {
        var categoryOrder = ['SGA%', 'R&D%', 'Depreciation %', 'Operating Expense %', 'Interest Expense %','Operating Margin', 'Total Revenue', 'Cost Of Revenue', 'Gross Profit', 'Gross Profit Margin', 'Pretax Income', 'Net Earnings', 'EBITDA','Basic EPS', 'Net Earnings to Total'];
    } if (type=='ABS') {
        var categoryOrder = ['Cash And Cash Equivalents','Inventory', 'Receivables','Current Assets','Current Ratio','Fixed Asset Turnover Ratio','Total Non Current Assets','Total Assets','Return on Asset Ratio'];
    } if (type=='LBS') {
        var categoryOrder = ['Payables And Accrued Expenses','Current Debt', 'Long Term Debt','Current Liabilities','Total Non Current Liabilities Net Minority Interest','Total Liabilities Net Minority Interest','Net Debt','Total Debt','Debt to Shareholders Equity Ratio'];
    } if (type=='TBS') {
        var categoryOrder = ['Common Stock','Retained Earnings','Stockholders Equity','Return on Shareholders Equity'];
    } if (type=='CF') {
        var categoryOrder = ['Free Cash Flow','Net Income','Net Income From Continuing Operations','Capital Expenditures %', 'Net Common Stock Issuance'];
    } if (type=='Valuations') {
        var categoryOrder = ['Current Stock Price', 'Market Cap','Trailing P/E','Forward P/E','Trailing PEG Ratio','P/FCF','Discounted Cash Flow Model','Peter Lynchs Valuation','Benjamin Grahams Valuation','Multiples Valuation','Dividend Discount Model'];
    } 
    var dataCat1=Object.keys(data);
    var dataCat2 = Object.keys(data2);
    
    var endList=[];
    for (let element of categoryOrder) {
        if (dataCat1.includes(element) || dataCat2.includes(element)) {
            endList.push(element);
        }
    }
    return endList;
}
