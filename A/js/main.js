const canvas = document.querySelector("#canvas");
const up = document.getElementsByTagName("div")[0];
const left = document.getElementsByTagName("div")[1];
const down = document.getElementsByTagName("div")[2];
const right = document.getElementsByTagName("div")[3];
const ctx = canvas.getContext('2d');
var nb_case = 30;
canvas.width = nb_case*10;
var w_canvas = canvas.width;
var case_size = w_canvas/nb_case;
canvas.height = nb_case*10;
var grid = new Array (nb_case);
var i;
var j;
var xA;
var yA;
var xB;
var yB; 
var path;
var closedList = [];
var openList = [];
xA = Math.floor(Math.random() * (nb_case - 1) + 1) - 1;
yA = Math.floor(Math.random() * (nb_case - 1) + 1) - 1;
xB = Math.floor(Math.random() * (nb_case - 1) + 1) - 1;
yB = Math.floor(Math.random() * (nb_case - 1) + 1) - 1;
var start;
var end;

for (i = 0; i < nb_case; i++){
 	ctx.beginPath();
 	ctx.moveTo(0,i*case_size);
 	ctx.lineTo(w_canvas,i*case_size);
 	ctx.stroke();
 	ctx.closePath();
/*-------------------------------*/
 	ctx.beginPath();
 	ctx.moveTo(i*case_size,0);
 	ctx.lineTo(i*case_size,w_canvas);
 	ctx.stroke();
 	ctx.closePath();
}

function Cells(i,j){
	this.i = i;
	this.j = j;
	this.wall = false;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.show = function (color){
		ctx.fillStyle = color;
		ctx.fillRect(this.i*case_size,this.j*case_size,case_size,case_size);
	}
	this.neighbors = [];
	this.previous = undefined;
	this.addNeighbors = function(grid) {
		i = this.i;
		j = this.j;
		if(i < nb_case - 1){
			this.neighbors.push(grid[i+1][j]);
		}
		if (i > 0){
			this.neighbors.push(grid[i-1][j]);
		}
		if (j < nb_case - 1){
			this.neighbors.push(grid[i][j+1]);
		}
		if (j > 0){
			this.neighbors.push(grid[i][j-1]);
		}
	}
}

function RemoveFromArray(arr, elt){
	for (i = arr.length - 1; i >= 0; i--) {
		if (arr[i] == elt){
			arr.splice(i, 1);
		}
	}
}

function heuristic(a,b){
	var d = Math.sqrt((b.i-a.i)*(b.i-a.i)+(b.j+a.j)*(b.j+a.j));
	return d;
}

for (i = 0; i < nb_case; i++){
	grid[i] = new Array (nb_case);
}

for (i = 0; i < nb_case; i++){
	for(j = 0; j < nb_case; j++){
		grid[i][j] = new Cells(i,j);
	}
}

for (i = 0; i < nb_case; i++){
	for(j = 0; j < nb_case; j++){
		grid[i][j].addNeighbors(grid);
	}
}

for (i = 0; i < nb_case; i++){
	for(j = 0; j < nb_case; j++){
		if (Math.random()<0.2){
			grid[i][j].wall = true;
			grid[i][j].show("#000");
		}
	}
}

start = grid[xA][yA];
end = grid[xB][yB];
console.log("x : " + end.i + "\ny : " + end.j);
grid[xA][yA].show("green");
grid[xB][yB].show("red");
start.wall = false;
end.wall = false;

openList.push(start);

function A(){
	if (openList.length > 0){
		var lowestIndex = 0;
		for (i = 0; i < openList.length; i++){
			if(openList[i].f < openList[lowestIndex].f){
				lowestIndex = i;
			}
		}
		var current = openList[lowestIndex];
		if (current === end){
			console.log("Finis !");
			path = [];
			var temp = current;
			path.push(temp);
			while(temp.previous){
				path.push(temp.previous);
				temp = temp.previous;
			}
			for (i = 0; i < path.length; i++){
				if (i==0){
					grid[path[i].i][path[i].j].show("red");
				}else if(i == path.length-1){
					grid[path[i].i][path[i].j].show("green");
				}else{
					grid[path[i].i][path[i].j].show("orange");
				}
			}
			stop();
			openList = 0;
		}
		RemoveFromArray(openList, current);
		closedList.push(current);
		var neighbors = current.neighbors;
		for (i = 0; i < neighbors.length; i++){
			var neighbor = neighbors[i];
			if (!closedList.includes(neighbor) && !neighbor.wall){
				var tempG = current.g + 1;
				if (openList.includes(neighbor)){
					if(tempG < neighbor.g ){
						neighbor.g = tempG;
					}
				}else{
					neighbor.g = tempG;
					openList.push(neighbor);
				}
				neighbor.h = heuristic(neighbor,end);
				neighbor.f = neighbor.g + neighbor.h;
				neighbor.previous = current;
			}
		}
	}else{
		console.log("Pas d'issues");
		return 0;
	}	
	for(i = 0; i < openList.length; i++){
		if (openList[i].i==xA && openList[i].j==yA){
			grid[openList[i].i][openList[i].j].show("green");
		}else if(openList[i].i==xB && openList[i].j==yB){
			grid[openList[i].i][openList[i].j].show("red");
		}else{
			grid[openList[i].i][openList[i].j].show("blue");
		}
	}
	for(i = 0; i < closedList.length; i++){
		if (closedList[i].i==xA && closedList[i].j==yA){
			grid[closedList[i].i][closedList[i].j].show("green");
		}else if(closedList[i].i==xB && closedList[i].j==yB){
			grid[closedList[i].i][closedList[i].j].show("red");
		}else{
			grid[closedList[i].i][closedList[i].j].show("grey");
		}
	}
}

var interval = setInterval(A,1);

function stop(){
	return 0;
}