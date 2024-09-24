var cells;
var matrix = []
var col;
var row;
var algorithm;
var speed=null;
var mazetype;

const board = document.getElementById("board");
const clearWallsBtn = document.getElementById("clearWallsBtn")
const clearBoardBtn = document.getElementById("clearBoardBtn")
const generateMazeBtn = document.getElementById("generateMazeBtn")
const visualiseBtn=document.getElementById("visualiseBtn");
const selectAlgo=document.getElementById("algo")
const selectSpeed= document.getElementById("speed")
const selectMaze=document.getElementById("mazetype")


function renderBoard() {
    let cellWidth = window.innerWidth <= 650 ? 30 : 20;
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
            e.target.classList.add(`${dragPoint}`)
            const cordinate = e.target.id.split('-');

            if (dragPoint === 'source') {
                source.x = +cordinate[0];
                source.y = +cordinate[1];
            }
            else {
                target.x = +cordinate[0];
                target.y = +cordinate[1];
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
        cell.classList.remove("costly");
        
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


function generateAlternateMaze(rowStart, rowEnd, colStart, colEnd, stepSize) {
    for (let i = rowStart; i <= rowEnd; i++) {
        for (let j = colStart; j <= colEnd; j++) {
            // Create stairs by making walls in a staggered manner
            if ((i % stepSize === 0) && (j % stepSize === 0)) {
                if (i < rowEnd && matrix[i][j] && !matrix[i][j].classList.contains("source") && !matrix[i][j].classList.contains("target")) {
                    wallToAnimate.push(matrix[i][j]); // Vertical wall
                }
                if (j < colEnd && matrix[i][j] && !matrix[i][j].classList.contains("source") && !matrix[i][j].classList.contains("target")) {
                    wallToAnimate.push(matrix[i][j]); // Horizontal wall
                }
            }
        }
    }
}
function generateRandomMaze(rowStart, rowEnd, colStart, colEnd,wallCount) {
    
    for (let i = rowStart; i <= rowEnd; i++) {
        for (let j = colStart; j <= colEnd; j++) {
            if(wallCount==0)return;
            // Create stairs by making walls in a staggered manner
            let randomRow= Math.floor(Math.random()*(row-1)+1);
            let randomCol=Math.floor(Math.random()*(col-1)+1);
          
                if (randomRow < rowEnd && randomCol < colEnd && matrix[randomRow][randomCol] && !matrix[randomRow][randomCol].classList.contains("source") && !matrix[randomRow][randomCol].classList.contains("target")) {
    
                    matrix[randomRow][randomCol].classList.add("wall")
                    wallCount--;
                }
            
        }
    }
}

selectMaze.addEventListener("change", (e) => {
    mazetype = e.target.value;
    // Optionally, reset the maze on selection change
    resetMaze();
    
    switch (mazetype) {
        case "FullMaze":
            generateMaze(0, row - 1, 0, col - 1, false, "horizontal");
            break; // Add a break statement to prevent fall-through
        case "AlternateMaze":
            generateAlternateMaze(0, row - 1, 0, col - 1, 2);
            break; // Add a break statement
        case "randomWalls":
            generateRandomMaze(0, row - 1, 0, col - 1, 50);
            break; // Add a break statement
        default:
            console.log("Please select a valid maze type.");
    }
    animate(wallToAnimate, 'wall');

});

// function handleMazeGeneraton(type) {
//     // You don't need a nested click event listener here
//     resetMaze();
   
// }

// Function to reset the maze
function resetMaze() {
    cells.forEach((cell) => {
        cell.classList.remove("wall");
        cell.classList.remove("visited");
        cell.classList.remove("path");
    });
    wallToAnimate = [];
    pathToAnimate = [];
}



///////////////////PATH FINDING ALGORITHM////////////////
///////////////////////BFS///////////////////////////////
selectAlgo.addEventListener("change",(e)=>{
    algorithm=e.target.value
})
selectSpeed.addEventListener("change",(e)=>{
    if(e.target.value=="slow"){
        speed=10; //delay in animation
    }
    else if(e.target.value=="medium"){
        speed=5;
    }
    else {
        speed=2
    }
    
})

var visitedCell=[];
var pathToAnimate=[]
visualiseBtn.addEventListener("click",()=>{
    visitedCell=[];
    pathToAnimate=[]

    switch(algorithm){
        case "dijstkra":
            dijstkra()
            break;
        case "greedy":
            greedy()
            break;
        case "bfs":
            bfs()
            break;
        case "Astar":
            Astar();
            break;
        case "dfs":
            
        var visited=new Set();
            dfs(source,visited);
            break;
    }
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
                if(!parentMap.has(`${nrow}-${ncol}`)){
                    parentMap.set(`${nrow}-${ncol}`,cell);//child:parent
                }
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


///////////////////dijstkra algo//////////////////
class priority_queue{
    constructor(){
        this.elements=[];
        this.length=0;
    }

    push(data){
        this.elements.push(data);
        this.length++;
        this.upheapify(this.length-1);
    }
    pop(){

        this.swap(0,this.length-1);
        const poped=this.elements.pop();
        this.length--;
        this.downHeapify(0);
        return poped;

    }
    upheapify(i){
        if(i==0)return ;//reached at top
        const parent= Math.floor((i-1)/2);
        if(this.elements[i].cost <this.elements[parent].cost){
            this.swap(parent,i);
            this.upheapify(parent);
        }
    }
    downHeapify(i){
        let minNode=i;
        let leftChild= (2*i)+1;
        let rightChild=(2*i)+2;

        if(leftChild <this.length && this.elements[leftChild].cost < this.elements[minNode].cost){
            minNode=leftChild;
        }
        if(rightChild <this.length && this.elements[rightChild].cost < this.elements[minNode].cost){
            minNode=rightChild
        }

        if(minNode!=i){
            this.swap(minNode,i);
            this.downHeapify(minNode)
        }
    }
    swap(x, y) {
        [this.elements[x], this.elements[y]] = [this.elements[y], this.elements[x]];
    }
    isPresent(coordinate) {
        for (let element of this.elements) {
            if (element.coordinate.x === coordinate.x && element.coordinate.y === coordinate.y) {
                return true;
            }
        }
        return false;
    }

 
}

function dijstkra(){
   
    const pq=new priority_queue();
    const parentMap=new Map();//trackback the path
    const distance =[];

    for(let i=0;i<row;i++){
        const currRow=[]
        for(let j=0;j<col;j++){
            currRow.push(Infinity)
        }
        distance.push(currRow)
    }
    
    
    distance[source.x][source.y] = 0;
    pq.push({coordinate:source,cost:0});   
    let drows = [-1, 0, 1, 0];
    let dcols = [0, 1, 0, -1]; 
    while (pq.length > 0) {
        const {coordinate,cost}=pq.pop();

        if(coordinate.x==target.x && coordinate.y==target.y){
            getPath(parentMap,target)
            return ;
        }
      
        for (let k = 0; k < 4; k++) {
           
            let nrow = coordinate.x + drows[k];
            let ncol = coordinate.y + dcols[k];

            if (nrow >= 0 && nrow < row && ncol >= 0 && ncol < col  && !matrix[nrow][ncol].classList.contains("wall") ) {
                const edgeWeight=getEdgeWeight(nrow,ncol); //Assuming edge weight = 1, between adjacent vertices
                    const newDist= cost + edgeWeight

                if(newDist < distance[nrow][ncol]){
                   distance[nrow][ncol]= newDist
                   pq.push({coordinate:{x:nrow,y:ncol},cost:newDist});
                   parentMap.set(`${nrow}-${ncol}`,coordinate)
                   visitedCell.push(matrix[nrow][ncol]) //to animate
                }
                
            }
        }

    }

   
}


function assignWeigths(){
    for(let i=0;i<row;i++){
        for(let j=0;j<col;j++){
            let randomWeight=Math.floor(Math.random()*(9)+1);// =RAND()*([UpperLimit]-[LowerLimit])+[LowerLimit].
         matrix[i][j].innerHTML=`${randomWeight}`
        }
    }
    matrix[source.x][source.y].innerHTML="0"
    matrix[target.x][target.y].innerHTML="0"
    console.log("source node",source)
    console.log("target node",target)
}

function getEdgeWeight(row, col) {
    // let value=  matrix[row][col].innerHTML
    // return parseInt(value);
    return Math.random()<0.5?1:2;
}


////////////////greedy//////////////////
function heuristicValue(node){
    return Math.abs( target.x-node.x) +  Math.abs(target.y - node.y);
}

function greedy(){
    const pq=new priority_queue();
    const visited=[];
    visitedCell=[] //to track back the path
    const parentMap=new Map();

    pq.push({coordinate:source,cost:heuristicValue(source)})
    visitedCell.push(matrix[source.x][source.y]);//to animate the visited ones
    visited.push(`${source.x}-${source.y}`);//our visited vector


    let drows = [-1, 0, 1, 0];
    let dcols = [0, 1, 0, -1];

    // debugger
    while (pq.length > 0) {
        let {coordinate,cost} = pq.pop();
        let i = coordinate.x;
        let j = coordinate.y;

        // Explore the four adjacent cells
        for (let k = 0; k < 4; k++) {
            let nrow = i + drows[k];
            let ncol = j + dcols[k];

            if (nrow >= 0 && nrow < row && ncol >= 0 && ncol < col  && !visited.includes(`${nrow}-${ncol}`)  && !matrix[nrow][ncol].classList.contains("wall")) {
                parentMap.set(`${nrow}-${ncol}`,coordinate);//child:parent
                visitedCell.push(matrix[nrow][ncol])  
                if(nrow== target.x && ncol==target.y){
                    getPath(parentMap,target);
                    return;
                }
                visited.push(`${nrow}-${ncol}`)// Mark this cell as visited
                pq.push({coordinate:{x:nrow,y:ncol},cost:heuristicValue({x:nrow,y:ncol})});  // Enqueue the updated cell
            }
        }
    }
}

///////////////////A* algorithm///////////////////

function Astar() {
    const pq = new priority_queue();;
    const  closedSet= new Set();//closedset
    const openSet = new Set();//openset which server the same purpose as priority queue you need this separate because a priority queue doesn't provide an efficient way to check if a node is already in it.
    const parent = new Map();
    const distance = [];//gscore

    for (let i = 0; i < row; i++) {
        const INF = [];
        for (let j = 0; j < col; j++) {
            INF.push(Infinity);
        }
        distance.push(INF);
    }

    distance[source.x][source.y] = 0;
    pq.push({ cordinate: source, cost: heuristicValue(source) });
    

    while (pq.length > 0) {
        const { cordinate: current } = pq.pop();
       

        //you find the target
        if (current.x === target.x && current.y === target.y) {
            getPath(parent, target);
            return;
        }

        closedSet.add(`${current.x}-${current.y}`); //marked it visited because now we will processing it's neighbours

        const neighbours = [
            { x: current.x - 1, y: current.y },//up
            { x: current.x, y: current.y + 1 },//right
            { x: current.x + 1, y: current.y },//bottom
            { x: current.x, y: current.y - 1 }//right
        ];

        for (const neighbour of neighbours) {
            const key = `${neighbour.x}-${neighbour.y}`;

            if ((neighbour.x >=0 && neighbour.x <row && neighbour.y>=0 && neighbour.y <col) &&
                !closedSet.has(key) &&//this should not be visited
                !openSet.has(key) && //this should not be queued
                !matrix[neighbour.x][neighbour.y].classList.contains('wall')
            ) {

                //Assuming edge weight = 1, between adjacent vertices
                const edgeWeight = 1;
                const gn = distance[current.x][current.y] + edgeWeight;
                const newfn = gn + heuristicValue(neighbour);

                if (gn < distance[neighbour.x][neighbour.y]) {
                    distance[neighbour.x][neighbour.y] = gn;

                    pq.push({ cordinate: neighbour, cost: newfn });
                    openSet.add(key);//openset to track which elements are in the pq.

                    parent.set(key, current);
                    visitedCell.push(matrix[current.x][current.y]);
                }
            }
        }
    }
}

    function dfs(node,visited){
        if(node.x==target.x && node.y==target.y){
            return true;
        }

        visitedCell.push(matrix[node.x][node.y]);
        visited.add(`${node.x}-${node.y}`);

        let drows=[-1,0,1,0];
        let dcols=[0,1,0,-1];

        for(let k=0;k<4;k++){
            let nrow= node.x + drows[k];
            let ncol=node.y +  dcols[k];

            if(nrow >=0 && nrow <row  && ncol >=0 && ncol <col && !visited.has(`${nrow}-${ncol}`) && !matrix[nrow][ncol].classList.contains("wall")){
                if(dfs({x:nrow,y:ncol}, visited)){
                    pathToAnimate.push(matrix[nrow][ncol]); //no need for the parent map as recursion does the backtracking 
                    return true;
                }
            }
        }
        return false
    }






function  animate(elements,classname){
    let delay=speed?speed:10; 
    if(classname=="path")delay=6
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