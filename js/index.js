var cells;
var matrix = []
var col;
var row;

const board = document.getElementById("board");
const clearWallsBtn = document.getElementById("clearWallsBtn")
const clearBoardBtn = document.getElementById("clearBoardBtn")
const generateMazeBtn = document.getElementById("generateMazeBtn")
const visualiseBtn=document.getElementById("visualiseBtn");


function renderBoard(cellWidth = 20) {
    row = Math.floor(board.clientHeight / cellWidth);
    col = Math.floor(board.clientWidth / cellWidth);//because height is same as width
    cells = []

    for (let i = 0; i < row; i++) {
        let rowArr = []
        const rowElement = document.createElement("div");
        rowElement.classList.add("row")
        rowElement.setAttribute("id", `${i}`);
        for (let j = 0; j < col; j++) {
            const colElement = document.createElement("div");
            colElement.classList.add("col")
            colElement.setAttribute("id", `${i}-${j}`);
            rowElement.appendChild(colElement)
            cells.push(colElement) //pushed all columns
            rowArr.push(colElement)
        }
        matrix.push(rowArr)
        board.appendChild(rowElement)
    }
}
renderBoard()

function set(classname, x = -1, y = -1) {
    if (x >= 0 && y >= 0 && x < row && y < col) {
        matrix[x][y].classList.add(classname)
    }
    else {
        //any random cell
        x = Math.floor(Math.random() * row);
        y = Math.floor(Math.random() * col);
        matrix[x][y].classList.add(classname)
    }
    return { x, y };
}

const  source = set("source")
const  target = set("target")
console.log("initial source:",source)

let dragPoint = null;
let isDragging = false;
let isDrawing = false;
cells.forEach((cell) => {

    
    const pointerDown = (e) => {
        if (e.target.classList.contains("source")) {
            isDragging = true;
            dragPoint = "source"
        }
        else if (e.target.classList.contains("target")) {
            isDragging = true;
            dragPoint = "target"
        }
        else {
            isDrawing = true;
        }
    }

    const pointerMove = (e) => {
        if (isDrawing) {
            e.target.classList.add("wall")
        }
        else if(dragPoint && isDragging) {
            cells.forEach((cell) => {
                cell.classList.remove(dragPoint)
            })
            cell.classList.add(dragPoint)
            let coordinate = source.x = e.target.id.split("-")

            if (dragPoint == "source") {
                source.x = parseInt(coordinate[0])
                source.y = parseInt(coordinate[1]);
            } else {
                target.x = parseInt(coordinate[0])
                target.y = parseInt(coordinate[1]);
            }

          
        }
    }
    const pointerUp = (e) => {
        isDragging = false;
        isDrawing = false;
        dragPoint = null
    }
    cell.addEventListener("pointerdown", pointerDown)
    cell.addEventListener("mousemove", pointerMove)
    cell.addEventListener("pointerup", pointerUp)
    cell.addEventListener("click", (e) => {
        e.target.classList.toggle("wall")
    })
})


clearBoardBtn.addEventListener("click", () => {
    cells.forEach((cell) => {
        cell.classList.remove("wall")
        cell.classList.remove("visited");
        cell.classList.remove("path")
    })
})
clearWallsBtn.addEventListener("click", () => {
    cells.forEach((cell) => {
        cell.classList.remove("wall")
    })
})


/////////////////////////////////////////////////////
//////////////GENERATE MAZE ALGORITHM///////////////
var wallToAnimate;
function generateMaze(rowStart, rowEnd, colStart, colEnd, surroundingWall, orientation) {
    if (rowStart > rowEnd || colStart > colEnd) {
        return;
    }


    if (!surroundingWall) {//step-1
        for (let i = 0; i < row; i++) {
            if (!matrix[i][0].classList.contains("source") || !matrix[i][0].classList.contains("target")) {
                // matrix[i][0].classList.add("wall")
                wallToAnimate.push(matrix[i][0]);//push it whenever you are adding the wall class
            }
            if (!matrix[i][col - 1].classList.contains("source") || !matrix[i][col - 1].classList.contains("target")) {
                wallToAnimate.push(matrix[i][col-1])
            }
        }

        for (let j = 0; j < col; j++) {
            if (!matrix[0][j].classList.contains("source") || !matrix[0][j].classList.contains("target")) {
                wallToAnimate.push(matrix[0][j])
            }
            if (!matrix[row - 1][j].classList.contains("source") || !matrix[row - 1][j].classList.contains("target")) {
                wallToAnimate.push(matrix[row-1][j])
            }
        }
        surroundingWall = true;
    }

    if (orientation == "horizontal") {
        let possibleRows = [];
        let possibleCols = [];

        for (let i = rowStart; i <= rowEnd; i += 2) {
            possibleRows.push(i);
        }

        for (let j = colStart - 1; j <= colEnd + 1; j += 2) {
            if (j > 0 && j < col - 1) {
                possibleCols.push(j);
            }
        }

        //select the current row
        const currentRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];
        const randomCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];

        for (let j = colStart - 1; j <= colEnd + 1; j++) {
            const cell = matrix[currentRow][j];
            if (!cell || j == randomCol || cell.classList.contains("source") || cell.classList.contains("target")) {
                continue;
            }
            // cell.classList.add("wall");
            wallToAnimate.push(cell)
        }

        //upper subdivision
        generateMaze(rowStart, currentRow - 2, colStart, colEnd, surroundingWall, (((currentRow - 2) - rowStart) > (colEnd - colStart)) ? "horizontal" : "vertical");
        generateMaze(currentRow + 2, rowEnd, colStart, colEnd, surroundingWall, ((rowEnd - (currentRow + 2)) > (colEnd - colStart)) ? "horizontal" : "vertical")

    }
    else {
        let possibleRows = [];
        let possibleCols = [];

        for (let i = rowStart - 1; i <= rowEnd + 1; i += 2) {
            if (i > 0 && i < row - 1) {
                possibleRows.push(i);
            }
        }
        for (let j = colStart; j <= colEnd; j += 2) {
            possibleCols.push(j);
        }

        //select the current col
        const currentCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];
        const randomRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];

        for (let i = rowStart - 1; i <= rowEnd + 1; i++) {
            if (!matrix[i]) continue
            const cell = matrix[i][currentCol];
            if (i == randomRow || cell.classList.contains("source") || cell.classList.contains("target")) {
                continue;
            }
            // cell.classList.add("wall"); or add this into wallToAnimate
            wallToAnimate.push(cell)
        }

        generateMaze(rowStart, rowEnd, colStart, currentCol - 2, surroundingWall, ((rowEnd - rowStart) > ((currentCol - 2) - colStart)) ? "horizontal" : "vertical")
        generateMaze(rowStart, rowEnd, currentCol + 2, colEnd, surroundingWall, ((rowEnd - rowStart) > (colEnd - (currentCol + 2))) ? "horizontal" : "vertical")

    }


}

generateMazeBtn.addEventListener("click",()=>{
    cells.forEach((cell)=>{
        cell.classList.remove("wall");
    })
    wallToAnimate=[]
    generateMaze(0,row-1,0,col-1,false,"horizontal")
    animate(wallToAnimate,'wall');
})



///////////////////PATH FINDING ALGORITHM////////////////
///////////////////////////////////////////////////////

var visitedCell=[];
var pathToAnimate=[]
visualiseBtn.addEventListener("click",()=>{
    visitedCell=[];
    bfs();
    animate(visitedCell,"visited")
    
})

function bfs() {

    const queue=[];
    const visited=[];
    const parentMap=new Map();

    queue.push(source)
    visitedCell.push(matrix[source.x][source.y]);//to animate the visited ones
    visited.push(`${source.x}-${source.y}`);//our visited vector


    let drows = [-1, 0, 1, 0];
    let dcols = [0, 1, 0, -1];

    // debugger
    while (queue.length > 0) {
        let cell = queue.shift();
        let i = cell.x;
        let j = cell.y;

        // Explore the four adjacent cells
        for (let k = 0; k < 4; k++) {
            let nrow = i + drows[k];
            let ncol = j + dcols[k];

            if (nrow >= 0 && nrow < row && ncol >= 0 && ncol < col  && !visited.includes(`${nrow}-${ncol}`)  && !matrix[nrow][ncol].classList.contains("wall")) {
                parentMap.set(`${nrow}-${ncol}`,cell);//child:parent
                visitedCell.push(matrix[nrow][ncol])  
                if(nrow== target.x && ncol==target.y){
                    getPath(parentMap,target);
                    return;
                }
                visited.push(`${nrow}-${ncol}`)// Mark this cell as visited
                queue.push({x:nrow,y:ncol});  // Enqueue the updated cell
            }
        }
    }
}

function getPath(parentMap,target){
    if(!target)return;
    pathToAnimate.push(matrix[target.x][target.y]);

    const parent= parentMap.get(`${target.x}-${target.y}`)
    getPath(parentMap,parent)

}


function  animate(elements,classname){
    let delay=10; 
    if(classname=="wall")delay=1
    for(let i=0;i<elements.length;i++){
        setTimeout(()=>{
            elements[i].classList.remove("visited")//you are removing this class so that the animate funciton cannot call it multiple times due to the for loop when it first called by pathToAnimate ,due to removal because you have the "visited" class check you will not end up having multiple calls. 
             elements[i].classList.add(classname);
             if(i==elements.length-1 && classname=="visited"){
                // inorder to see the shortest path
                animate(pathToAnimate,"path")
             }

        },delay*i)  
    }
}