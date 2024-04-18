document.addEventListener("DOMContentLoaded", function() {
    // Your JavaScript code here
    function fetchData(){
        var input = document.getElementById("ticker").value;
        console.log("Ticker input value:", input);
        var data = {'ticker': input};
        var compareData = 'n/a'
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
            main(data,compareData); // Pass the received data to createISTable function
        })
        .catch(error => console.error('Error:', error));
    }

    document.getElementById("tickerForm").addEventListener("submit", function(event) {
        event.preventDefault();
        fetchData();
    });
});

function main(mainData,compareData) {
    var compareButtonDiv = document.getElementById("compare-button");
    var companyName = document.getElementById("company-title");
    var summaryDiv=document.getElementById('summary');
    var summaryBox=document.getElementById('summaryBox')
    var massContainer = document.getElementById("output-container");
    while (massContainer.firstChild) {
        massContainer.removeChild(massContainer.firstChild);
    }
    massContainer.innerHTML='';
    summaryDiv.innerHTML='';
    companyName.innerHTML='';

    
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
        fetchDataCompare(inputValue, mainData); // Pass inputValue and data to fetchData2
});
    // Append the compare button to the output div
    compareButtonDiv.appendChild(compareButton);

    //extract data
    var mainBasics=mainData['Basics'];
    var mainSummary=mainData['Summary'];
    var mainIS=mainData["IS"];
    var mainABS=mainData["ABS"];
    var mainLBS=mainData["LBS"];
    var mainTBS=mainData["TBS"];
    var mainCF=mainData["CF"];
    var mainValuations=mainData["Valuations"];
    if (compareData!='n/a') {
        var compareBasics=compareData['Basics']
        var compareIS=compareData["IS"]
        var compareABS=compareData["ABS"]
        var compareLBS=compareData["LBS"]
        var compareTBS=compareData["TBS"]
        var compareCF=compareData["CF"]
        var compareValuations=compareData["Valuations"]
        var compareSummary=compareData['summary']
    } else {
        var compareBasics='n/a'
        var compareIS='n/a'
        var compareABS='n/a'
        var compareLBS='n/a'
        var compareTBS='n/a'
        var compareCF='n/a'
        var compareValuations='n/a'
        var compareSummary='n/a'
    };

    //Add Summary
    if (compareSummary=='n/a') {
        if (summaryDiv.contains(summaryBox)) {
            summaryDiv.removeChild(summaryBox);
        }
        var summaryBox=document.createElement('div');
        summaryBox.id = 'summaryBox';
        
        summaryBox.innerHTML = mainSummary;
        summaryDiv.appendChild(summaryBox);
    }

    //set company name and place title
    var mainCompanyName=mainData["Company Name"]
    if (compareData!='n/a') {
        var compareCompanyName=compareData['Company Name']
    } else {
        var compareCompanyName='n/a'
    };
    if (compareCompanyName=='n/a') {
        document.getElementById("company-title").innerHTML=mainCompanyName
    } else {
        document.getElementById("company-title").innerHTML=''
    };

    //create category order lists
    var basicsCategoryOrder=['Industry','Market Cap', 'Current Stock Price']
    var IScategoryOrder=createList(mainIS, compareIS, 'IS');
    var ABScategoryOrder=createList(mainABS, compareABS, 'ABS');
    var LBScategoryOrder=createList(mainLBS, compareLBS, 'LBS');
    var TBScategoryOrder=createList(mainTBS, compareTBS, 'TBS');
    var CFcategoryOrder=createList(mainCF, compareCF, 'CF');
    var valuationsCategoryOrder=createList(mainValuations, compareValuations, 'Valuations');
    
    //create tables
    createTable(mainBasics,compareBasics, basicsCategoryOrder,'Basic Stock Info', mainCompanyName, compareCompanyName);
    createTable(mainIS,compareIS,IScategoryOrder,'Income Statement', mainCompanyName, compareCompanyName);
    createTable(mainABS,compareABS,ABScategoryOrder,'Balance Sheet: Assets', mainCompanyName, compareCompanyName);
    createTable(mainLBS,compareLBS,LBScategoryOrder,'Balance Sheet: Liabilities', mainCompanyName, compareCompanyName);
    createTable(mainTBS,compareTBS,TBScategoryOrder,'Balance Sheet: Treasuries', mainCompanyName, compareCompanyName);
    createTable(mainCF,compareCF,CFcategoryOrder,'Cash Flow Statement', mainCompanyName, compareCompanyName);
    createTable(mainValuations,compareValuations,valuationsCategoryOrder,'Valuation Models', mainCompanyName, compareCompanyName);
}

function createTable(data,compareData,categoryOrder,title,mainCompanyName,compareCompanyName) {
    var tableContainer=document.createElement("div")
    tableContainer.classList.add('output');
    var contentContainer=document.querySelector(".content");
    var massContainer=document.getElementById('output-container');

    //Create variables for table elements
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');

    //Edit Style
    table.style.borderCollapse = "collapse"; 
    table.style.marginLeft = 'auto';
    table.style.marginRight = 'auto';

    //Create caption
    var caption=document.createElement('div')
    caption.innerHTML = title;
    caption.classList.add('table-caption');
    massContainer.appendChild(caption);

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

    // Create row for "main company"
    if (compareCompanyName!='n/a') {
        var mainCompanyRow = document.createElement('tr');
        var mainCompanyCell = document.createElement('td');
        mainCompanyCell.textContent = mainCompanyName;
        mainCompanyCell.style.border = "1px solid black";
        mainCompanyCell.style.backgroundColor = '#e5e5ec ';
        mainCompanyCell.colSpan = categoryOrder.length + 1; // Span all columns
        mainCompanyRow.appendChild(mainCompanyCell);
        tbody.appendChild(mainCompanyRow);
    };

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

    // Create row for "other company"
    if (compareCompanyName!='n/a') {
        var otherCompanyRow = document.createElement('tr');
        var otherCompanyCell = document.createElement('td');
        otherCompanyCell.textContent = compareCompanyName;
        otherCompanyCell.style.backgroundColor = '#e5e5ec ';
        otherCompanyCell.style.border = "1px solid black";
        otherCompanyCell.colSpan = categoryOrder.length + 1; // Span all columns
        otherCompanyRow.appendChild(otherCompanyCell);
        tbody.appendChild(otherCompanyRow);
    };

    //Create table body for comparison
    if (compareCompanyName!='n/a') {
        var data2Keys = Object.keys(compareData);
        var startIdx = Math.max(data2Keys.length - 2, 0); // Start from the last two years or 0 if less than two years
        data2Keys.slice(startIdx).forEach(function (year) {
            var yearData = compareData[year];
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
    }

    // Append table to document body
    table.classList.add('.table');
    tableContainer.appendChild(table);
    massContainer.appendChild(tableContainer);
    var lineBreak = document.createElement('div');
    lineBreak.classList.add('table-separator');
    tableContainer.appendChild(lineBreak);
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

function fetchDataCompare(inputValue, mainData){
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
        main(mainData,data); // Pass the received data to createISTable function
    })
    .catch(error => console.error('Error:', error));
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

function createList(mainData,compareData,type) {
    if (type=='Valuations') {
        data=mainData['current']
        if (compareData!='n/a') {
            data2 =compareData['current']
        }
        else {
            data2={}
        }
    }
    else {
        var data=mainData['YoY(past year)']
        
        if (compareData!='n/a') {
            data2 =compareData['YoY(past year)']
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