

async function getFriends() 
{   
    try
    {
        const result = await fetch("http://localhost:8383/friends",
        {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        });
        console.log(result);
        let convertedToJSON = await result.json();
        console.log(convertedToJSON)

    }
    catch(err)
    {
        console.log(err)
    }
}

async function getStuff() 
{   
    try
    {
        console.log('getStuff')
        const result = await fetch("http://localhost:8383/stuff",
        {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        });
        console.log(result);
        let convertedToJSON = await result.json();
        console.log(convertedToJSON)

    }
    catch(err)
    {
        console.log(err)
    }
}

let allLifts = null;

//This function makes a GET request, and retrieves the entire 'lift' document, then 'buildTable()' outputs the returned array of objects onto a table
async function getAllLifts()
{
    try
    {
        const result = await fetch("http://localhost:8383/getAllLifts",
        {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
        let convertedToJSON = await result.json();
        
        console.log(convertedToJSON);
        console.table(convertedToJSON);
        
        // Set global value for allLifts
        allLifts = convertedToJSON;

        buildTable(convertedToJSON);
   
    }
    catch(err)
    {
        console.log(err)
    }
}


async function postLift()
{   
    let body = 
    {
        liftType: $("#lift").val(),
        weight: $("#weight").val(),
        reps: $("#reps").val(),
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

// Build / populate table
   
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
                        <td>${data[i].date}</td>
                    </tr>`
        table.innerHTML += row
    }
}

// Function to GET a single document (a single 'lift)

function getSingleLift(i)
{
    console.log(allLifts)
    console.log(allLifts[i].lift)
}

$('th').on('click', () =>
{

    
    console.log(this)
    
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





