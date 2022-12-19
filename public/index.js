// Had to build 2 buildtable functions, because I needed to remove the table clearing line from one
// Added 'allLifts' variable, which 


// Fires when webpage loads, to set the 4 collection variables
fetchAllCollections()
let allLifts = null;
let armday = null;
let legday = null;
let pullday = null;
let pushday = null;








// This function/event listens for 'keyup'
$('#search-input').on('keyup', function()
{
    let value = $(this).val()
    let data = searchTable(value, allLifts)
    buildTable(data)
} )

// This function/event listens to the 'th' elements, and sorts the columns by ascending or descending
$('th').on('click', function() 
{
    let order = $(this).data('order')
    let column = $(this).data('column')

    console.log('Column was clicked!', column, order)

    if (order == 'desc')
    {
        $(this).data('order', 'asc')
        allLifts = allLifts.sort((a,b) => a[column] > b[column] ? 1 : -1)
    }
    else
    {
        $(this).data('order', 'desc')
        allLifts = allLifts.sort((a,b) => a[column] < b[column] ? 1 : -1)
    }
    
    buildTable(allLifts)
})

// This fetches the DB and stores it to 'allLifts.' Was necesarry to store the DB locally for search bar functionality
async function fetchAllLifts()
{
    try
    {
        const result = await fetch("http://localhost:8383/getalllifts",
        {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
        let convertedToJSON = await result.json();
        
        console.log(convertedToJSON);
        console.table(convertedToJSON);
       
        // Set global value for allLifts
        allLifts = convertedToJSON;
    }
    catch(err)
    {
        console.log(err)
    }
}

// This function builds the table using all 4 collections. It utilizes the 'buildTable()' function to do so
// Could it be built with the 'allLifts' variable?
function buildTableAll()
{
    buildTableWithCollection(armday);
    buildTableWithCollection(legday);
    buildTableWithCollection(pullday);
    buildTableWithCollection(pushday);
}

// Build / populate table (used by the search bar)
function buildTable(data)
{
    let table = document.getElementById('myTable');

    table.innerHTML = ''

    for (let i = 0; i < data.length; i++)
    {
        let row = `<tr>
                        <td> <a href="javascript:void(0);" onclick=getSingleLift(${i})> ${data[i].lift} </a></td>
                        <td>${data[i].weight}</td>
                        <td>${data[i].reps}</td>
                        <td>${data[i].date}<a href="javascript:void(0);" onclick=deleteLiftAndReloadTable('${data[i].id}')><i class="fa-solid fa-trash-can"></i></a>
                        <a href="javascript:void(0);" onclick=editLiftAndReloadTable('${data[i].id}')><i class="fa-solid fa-pencil"></i></a></td>
                    </tr>`
        table.innerHTML += row
    }
}


// TEST PARAMS FUNCTION //

function testParams(path)
{
    console.log( "path :" + path)
}

// Needed to add a serparate builder because the original buildTable function clears the table at the beggining
function buildTableWithCollection(data)
{
    let table = document.getElementById('myTable');

    for (let i = 0; i < data.length; i++)
    {
        
        let row = `<tr>
                        <td> <a href="javascript:void(0);" onclick=getSingleLift(${i})> ${data[i].lift} </a></td>
                        <td>${data[i].weight}</td>
                        <td>${data[i].reps}</td>
                        <td>${data[i].date}<a href="javascript:void(0);" onclick=deleteLiftAndReloadTable('${data[i].id}','${data[i].path}')><i class="fa-solid fa-trash-can"></i></a>
                        <a href="javascript:void(0);" onclick=editLiftAndReloadTable('${data[i].id}')><i class="fa-solid fa-pencil"></i></a></td>
                    </tr>`
        table.innerHTML += row
    }
}

// Searches database and rebuilds the table upon every keystroke
function searchTable(value, data)
{
    let filteredData = [];

    for (let i = 0; i < data.length; i++)
    {
        value = value.toLowerCase()
        let lift = data[i].lift.toLowerCase()

        if (lift.includes(value))
        {
            filteredData.push(data[i])
        }
    }
    return filteredData
}

// Deletes the entire table from the screen
function clearTable()
{
    let table = document.getElementById('myTable');
    table.innerHTML = ''
}

// This function fetches the 'armday' collection
async function fetchArmDay()
{
    try
    {
        const result = await fetch("http://localhost:8383/getarmday",
        {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
        let convertedToJSON = await result.json();
        
        console.log(convertedToJSON);
        console.table(convertedToJSON);
       
        // Set global value for allLifts
        armday = convertedToJSON;
        
        

    }
    catch(err)
    {
        console.log(err)
    }
}

// This function fetches the 'legday' collection
async function fetchLegDay()
{
    try
    {
        const result = await fetch("http://localhost:8383/getlegday",
        {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
        let convertedToJSON = await result.json();
        
        console.log(convertedToJSON);
        console.table(convertedToJSON);
       
        // Set global value for legday
        legday = convertedToJSON;
    }
    catch(err)
    {
        console.log(err)
    }
}

// This function fetches the 'pullday' collection
async function fetchPullDay()
{
    try
    {
        const result = await fetch("http://localhost:8383/getpullday",
        {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
        let convertedToJSON = await result.json();
        
        console.log(convertedToJSON);
        console.table(convertedToJSON);
       
        // Set global value for pullday
        pullday = convertedToJSON;
    }
    catch(err)
    {
        console.log(err)
    }
}

// This function fetches the 'pushday' collection
async function fetchPushDay()
{
    try
    {
        const result = await fetch("http://localhost:8383/getpushday",
        {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
        let convertedToJSON = await result.json();
        
        console.log(convertedToJSON);
        console.table(convertedToJSON);
    
        // Set global value for pushday
        pushday = convertedToJSON;
    }
    catch(err)
    {
        console.log(err)
    }
}

// This function makes a POST request, and posts a lift to the firestore db
async function postLift()
{   
    let body = 
    {
        liftType: $("#lift").val(),
        weight: $("#weight").val(),
        reps: $("#reps").val(),
        splitday: $("#splitday").val()
    }

    try
    {
        const result = await fetch("http://localhost:8383/addlift",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });
        let convertedToJSON = await result.json();
        console.log(convertedToJSON)
        

    }
    catch(err)
    {
        console.log(err)
    }
}

// Sends a DELETE request, with {id: docId} as the body. The '{id: docId}' was imprinted into the HTML upon table created.
async function deleteLift(docId, path)
{
    
        let body = 
        {
            id: docId,
            path: path
        }
    
        try
        {
            const result = await fetch("http://localhost:8383/deletelift",
            {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            
        }
        catch(err)
        {
            console.log(err)
        }
    
}

// Send a POST request to EDIT a lift, with {id. docId} included in the body
async function editLift(docId)
{
    let body = 
    {
        liftType: $("#lift").val(),
        weight: $("#weight").val(),
        reps: $("#reps").val(),
        splitday: $("#splitday").val(),
        id: docId
        
    }
     try
    {
        const result = await fetch("http://localhost:8383/editlift",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });
        let convertedToJSON = await result.json();
        console.log(convertedToJSON)
    }
    catch(err)
    {
        console.log(err)
    }
}

// Deletes a single lift and rebuilds the table
async function deleteLiftAndReloadTable(docId, path)
{
     await deleteLift(docId, path).then(await fetchAllCollections()).then(clearTable(), buildTableAll())
}  

// Edits a single lift and rebuilds the table
async function editLiftAndReloadTable(docId)
{
    await editLift(docId).then(await fetchAllCollections()).then(clearTable(), buildTableAll())
}

// This function fetches all the collections
async function fetchAllCollections()
{
await fetchArmDay().then(await fetchLegDay()).then(await fetchPullDay()).then(await fetchPushDay()).then(setAllLifts())
}


// This function loads to 'allLifts' variable with all 4 collections, it also loads the 'path' variable
function setAllLifts()
{
    allLifts = [...armday, ...legday, ...pullday, ...pushday]
    console.log(allLifts)
}




