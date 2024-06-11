document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch data
    function fetchData() {
        var input = document.getElementById("ticker").value;
        var timeframe = document.getElementById("timeframeSwitch").checked ? "Quarterly" : "Yearly"
        console.log("Ticker input value:", input);
        var data = { 'ticker': input, 'timeframe': timeframe };
        var compareData = 'n/a';
        
        fetch('https://pythia-14fbe9516611.herokuapp.com/main', {
        //fetch('http://127.0.0.1:5000/main', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        })
        .then(response => response.json())
        .then(data => {
            // Process the received data
            console.log("Received data:", data);
            main(data, compareData); // Pass the received data to createISTable function
        })
        .catch(error => console.error('Error:', error));
    }
    

    // Event listener for form submission
    document.getElementById("tickerForm").addEventListener("submit", function(event) {
        event.preventDefault();
        fetchData();
    });

    // Event listener for switch state change
    var timeframeSwitch = document.getElementById("timeframeSwitch");
    var switchLabel = document.getElementById("switchLabel");

    timeframeSwitch.addEventListener("change", function() {
        if (timeframeSwitch.checked) {
            switchLabel.textContent = "Quarterly";
        } else {
            switchLabel.textContent = "Yearly";
        }
    });
});

function fetchDataCompare(inputValue, mainData){
    console.log("Ticker input value:", inputValue);
    var data = {'ticker': inputValue};
    var timeframe = document.getElementById("timeframeSwitch").checked ? "Quarterly" : "Yearly"
    var data = { 'ticker': inputValue, 'timeframe': timeframe };
    fetch('https://pythia-14fbe9516611.herokuapp.com/main', {
    //fetch('http://127.0.0.1:5000/main', {
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

function main(mainData,compareData,category_input) {
    var companyName = document.getElementById("company-title");
    var summaryDiv=document.getElementById('summary');
    var summaryBox=document.getElementById('summaryBox')
    var massContainer = document.getElementById("output-container");
    var graphicContainer = document.getElementById('graphics');
    while (graphicContainer.firstChild) {
        graphicContainer.removeChild(graphicContainer.firstChild);
    }
    while (massContainer.firstChild) {
        massContainer.removeChild(massContainer.firstChild);
    }
    massContainer.innerHTML='';
    summaryDiv.innerHTML='';
    companyName.innerHTML='';

    // Create compare button
    compareButton(mainData);

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
    
    //create category order lists
    if (category_input !== undefined) {
        if (compareSummary!='n/a') {
            var compareYears=orderDates(compareData)
        }
        //Call types
        category = category_input[0];
        check = category_input[1];
        type = category_input[2];
        precheckedItems = category_input[3];

        var basicsCategoryOrder=['Industry','Market Cap', 'Current Stock Price']
        
        var IScategoryOrder=createListB(mainIS, compareIS, 'IS');
        IScategoryOrder = filterList(IScategoryOrder,precheckedItems);
        var ABScategoryOrder=createListB(mainABS, compareABS, 'ABS');
        ABScategoryOrder = filterList(ABScategoryOrder,precheckedItems);
        var LBScategoryOrder=createListB(mainLBS, compareLBS, 'LBS');
        LBScategoryOrder = filterList(LBScategoryOrder,precheckedItems);
        var TBScategoryOrder=createListB(mainTBS, compareTBS, 'TBS');
        TBScategoryOrder = filterList(TBScategoryOrder,precheckedItems);
        var CFcategoryOrder=createListB(mainCF, compareCF, 'CF');
        CFcategoryOrder = filterList(CFcategoryOrder,precheckedItems);
        var valuationsCategoryOrder=createList(mainValuations, compareValuations, 'Valuations');
        if (check==0) {
            if (type=='IS') {
                index = IScategoryOrder.indexOf(category);
                if (index > -1) {
                    IScategoryOrder.splice(index, 1);
                }
            };
            if (type=='BS') {
                if (ABScategoryOrder.includes(category)) {
                    ABScategoryOrder.splice(category,1);
                } 
                if (LBScategoryOrder.includes(category)) {
                    LBScategoryOrder.splice(category,1);
                } 
                if (TBScategoryOrder.includes(category)) {
                    TBScategoryOrder.splice(category,1);
                } 
            };
            if (type=='CF') {
                CFcategoryOrder.splice(category,1);
            };
        };
        if (check==1) {
            if (type=='IS') {
                IScategoryOrder.push(category);
            };
            if (type=='ABS') {
                ABScategoryOrder.push(category);
            };
            if (type=='CF') {
                CFcategoryOrder.push(category);
            };
        };
    } else {
        var mainYears=orderDates(mainData)
        if (compareSummary!='n/a') {
            var compareYears=orderDates(compareData)
        }
        var basicsCategoryOrder=['Industry','Market Cap', 'Current Stock Price', 'Annual Dividend']
        var IScategoryOrder=createList(mainIS, compareIS, 'IS');
        var ABScategoryOrder=createList(mainABS, compareABS, 'ABS');
        var LBScategoryOrder=createList(mainLBS, compareLBS, 'LBS');
        var TBScategoryOrder=createList(mainTBS, compareTBS, 'TBS');
        var CFcategoryOrder=createList(mainCF, compareCF, 'CF');
        var valuationsCategoryOrder=createList(mainValuations, compareValuations, 'Valuations');
    };

    var precheckedItems = IScategoryOrder.concat(ABScategoryOrder, LBScategoryOrder, TBScategoryOrder, CFcategoryOrder);

    // Create a dropdown menu
    dropDown(mainData,compareData,precheckedItems);
    console.log(precheckedItems)
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

    Object.keys(data).sort(function(a, b) {
        var yearA = parseInt(a.split(' ')[1]);
        var yearB = parseInt(b.split(' ')[1]);
        var quarterA = parseInt(a.split(' ')[0].slice(1));
        var quarterB = parseInt(b.split(' ')[0].slice(1));
    
        if (yearA !== yearB) {
            return yearA - yearB; // Sort by year first
        } else {
            return quarterA - quarterB; // Then sort by quarter within the same year
        }
    }).forEach(function (yearQuarter) {
        var yearData = data[yearQuarter];
        var row = document.createElement('tr');
        var yearCell = document.createElement('td');
        yearCell.textContent = yearQuarter;
        yearCell.style.border = "1px solid black";
        yearCell.style.backgroundColor = '#e5e5ec ';
        row.appendChild(yearCell);
    
        categoryOrder.forEach(function (category, index) {
            var cell = document.createElement('td');
            var value = yearData[category];
            if (String(value).indexOf('nan') !== -1) {
                value = "n/a"
            };
            cell.textContent = (typeof value === 'number') ? formatNumber(value) : value || '';
            cell.style.border = "1px solid black";
            cell.style.backgroundColor = getColorForValue(value,category,yearQuarter);
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
    if (value == 'n/a') {
        return '#e5e5ec '
    }
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
    if (year=='YoY'){
        return '#e5e5ec '
    };
    if (year=='QoQ'){
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
        console.log(timeframe);
        timeframe=checkType(mainData)
        var data=mainData[timeframe]
        
        if (compareData!='n/a') {
            data2 =compareData[timeframe]
        }
        else {
            data2={}
    }
    }
    if (type=='IS') {
        var categoryOrder = ['SGA%', 'R&D%', 'Depreciation %', 'Operating Expense %', 'Interest Expense %','Operating Margin', 'Total Revenue', 'Cost Of Revenue', 'Gross Profit', 'Gross Profit Margin', 'Pretax Income', 'Net Earnings', 'Basic EPS', 'Net Earnings to Total'];
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

function createListB(mainData, compareData, type) {
    let data, data2, timeframe;
    const categoryOrder = ['SGA%', 'R&D%', 'Depreciation %', 'Operating Expense %', 'Interest Expense %', 'Operating Margin', 'Total Revenue', 'Cost Of Revenue', 'Gross Profit', 'Gross Profit Margin', 'Pretax Income', 'Net Earnings', 'EBITDA', 'Basic EPS', 'Net Earnings to Total', 'Cash And Cash Equivalents', 'Inventory', 'Receivables', 'Current Assets', 'Current Ratio', 'Fixed Asset Turnover Ratio', 'Total Non Current Assets', 'Total Assets', 'Return on Asset Ratio', 'Payables And Accrued Expenses', 'Current Debt', 'Long Term Debt', 'Current Liabilities', 'Total Non Current Liabilities Net Minority Interest', 'Total Liabilities Net Minority Interest', 'Net Debt', 'Total Debt', 'Debt to Shareholders Equity Ratio', 'Common Stock', 'Retained Earnings', 'Stockholders Equity', 'Return on Shareholders Equity', 'Free Cash Flow', 'Net Income', 'Net Income From Continuing Operations', 'Capital Expenditures %', 'Net Common Stock Issuance', 'Current Stock Price', 'Market Cap', 'Trailing P/E', 'Forward P/E', 'Trailing PEG Ratio', 'P/FCF', 'Discounted Cash Flow Model', 'Peter Lynchs Valuation', 'Benjamin Grahams Valuation', 'Multiples Valuation', 'Dividend Discount Model'];

    if (type == 'Valuations') {
        data = mainData['current'];
        data2 = compareData != 'n/a' ? compareData['current'] : {};
    } else {
        console.log(timeframe);
        timeframe = checkType(mainData);
        data = mainData[timeframe];
        data2 = compareData != 'n/a' ? compareData[timeframe] : {};
    }

    let dataCat1 = Object.keys(data);
    let dataCat2 = Object.keys(data2);

    let endList = [];
    // Add elements from categoryOrder first
    for (let element of categoryOrder) {
        if (dataCat1.includes(element) || dataCat2.includes(element)) {
            endList.push(element);
        }
    }
    // Add any remaining elements from dataCat1 and dataCat2
    for (let element of dataCat1) {
            if (!categoryOrder.includes(element) && (dataCat1.includes(element) || dataCat2.includes(element))) {
                endList.push(element);
            }
        }
    return endList;
}

function compareButton(mainData) {
    var compareButtonDiv = document.getElementById("compare-button");
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
}

function orderDates(data) {
    // Extract keys from the object
    const keys = Object.keys(data);

    // Sort keys by date
    keys.sort((a, b) => {
        // Convert date strings to Date objects for comparison
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA - dateB;
    });

    // Move 'YoY' key to the end of the list
    timeframe=checkType(data);
    const index = keys.indexOf(timeframe);
    if (index !== -1) {
        keys.push(keys.splice(index, 1)[0]);
    }
    return keys
}


function dropDown(mainData, compareData,precheckedItems) {
    var dropdownContainer = document.querySelector(".dropdown");
    while (dropdownContainer.firstChild) {
        dropdownContainer.removeChild(dropdownContainer.firstChild);
    };
    var sidebar = document.querySelector('.sidebar');
    sidebar.appendChild(dropdownContainer);
   
    // Create IS Dropdown
    createDropdown("Income Statement Categories", mainData, compareData, dropdownContainer, 'IS',precheckedItems);

    // Create BS Dropdown
    createDropdown("Balance Sheet Categories", mainData, compareData, dropdownContainer, 'ABS',precheckedItems);

    // Create CF Dropdown
    createDropdown("Cash Flow Categories", mainData, compareData, dropdownContainer, 'CF',precheckedItems);
}

function createDropdown(title, AData, compareData, parent, type,precheckedItems) {
    var dropdownMenuDiv = document.createElement('div');
    dropdownMenuDiv.classList.add('dropdown-menu');
    dropdownMenuDiv.dataset.type = type; // Add a data attribute to identify the dropdown type
    parent.appendChild(dropdownMenuDiv);
    
    mainData = AData[type];
    
    var titleDiv = document.createElement("div");
    titleDiv.innerHTML = title;
    titleDiv.className = "dropdown-title";
    titleDiv.dataset.type = type; // Add a data attribute to identify the dropdown type
    titleDiv.addEventListener('click', function() {
        toggleDropdownMenu(type);
    });
    parent.appendChild(titleDiv);
    
    years = Object.keys(mainData);
    allCategories = years[0];
    timeframe=checkType(AData);
    var listMain = Object.keys(mainData[timeframe]);
    var listCompare = (typeof compareData === 'object' && compareData !== null && compareData !== 'n/a' && compareData[timeframe]) ? Object.keys(compareData[timeframe]) : [];
    var allCategories = Array.from(new Set([...listMain, ...listCompare]));

    allCategories.forEach(category => {
        var checkboxLabel = document.createElement("label");
        checkboxLabel.className = "dropdown-item";

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = category;

        if (precheckedItems.includes(category)) {
            checkbox.checked = true;
        }

        checkbox.addEventListener('change', function(event) {
            var isChecked = event.target.checked ? 1 : 0;
            // Trigger your custom function here
            yourFunction(category, isChecked, AData, compareData,titleDiv,precheckedItems);
        });

        var categoryName = document.createTextNode(category);
        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(categoryName);

        dropdownMenuDiv.appendChild(checkboxLabel);
    });
}

function toggleDropdownMenu(type) {
    var dropdownMenus = document.querySelectorAll('.dropdown-menu[data-type="' + type + '"]');
    dropdownMenus.forEach(menu => {
        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    });
}

document.addEventListener('click', function(event) {
    var clickedElement = event.target;
    var dropdownMenus = document.querySelectorAll('.dropdown-menu');

    dropdownMenus.forEach(menu => {
        // Check if the clicked element is inside the dropdown menu or its title
        var isClickInsideMenu = menu.contains(clickedElement);
        var isClickOnTitle = clickedElement.classList.contains('dropdown-title') && clickedElement.dataset.type === menu.dataset.type;

        // If the click is outside the menu and its title, hide the menu
        if (!isClickInsideMenu && !isClickOnTitle) {
            menu.style.display = 'none';
        }
    });
});

function yourFunction(category, isChecked, mainData, compareData,titleDiv,precheckedItems) {
    // Implement your custom function here
    var dataTypeValue = titleDiv.getAttribute('data-type');
    precheckedItems = precheckedItems.filter(item => item !== category);
    var category_output = [category, isChecked, dataTypeValue,precheckedItems];
    main(mainData,compareData, category_output);
    // You can perform any other action based on the checkbox state change here
}

function filterList(unfilteredList, precheckedItems) {
    // Create a Set from precheckedItems for efficient lookup
    const precheckedSet = new Set(precheckedItems);
    // Filter the unfilteredList while retaining the original order
    return unfilteredList.filter(item => precheckedSet.has(item));
}

function checkType(dictionary) {
    // Check if the dictionary has the key 'ABS'
    if ('ABS' in dictionary) {
        // Check if 'YoY' exists in the 'ABS' object
        if ('YoY' in dictionary['ABS']) {
            return 'YoY';
        }
        // Check if 'QoQ' exists in the 'ABS' object
        else if ('QoQ' in dictionary['ABS']) {
            return 'QoQ';
        }
    }
    if ('YoY' in dictionary) {
        return 'YoY';
    }
    // Check if 'QoQ' exists in the 'ABS' object
    else if ('QoQ' in dictionary) {
        return 'QoQ';
    }
    // If 'ABS' doesn't exist or neither 'YoY' nor 'QoQ' exist, return null
    return null;
}